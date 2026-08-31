import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Customer } from '../customers/customer.entity';
import {
  DeliveryAttempt,
  DeliveryStatus,
} from '../delivery-attempts/delivery-attempt.entity';
import { signPayload } from '../common/signing.util';
import { AxiosResponse } from 'axios';
import { exponentialBackoffWithJitter } from './backoff.strategy';

interface DeliverWebhookJobData {
  eventId: string;
  customerId: string;
  eventType: string;
  payload: Record<string, any>;
}

@Processor('delivery', {
  settings: {
    backoffStrategy: (attemptsMade: number) =>
      exponentialBackoffWithJitter(attemptsMade),
  },
})
export class DeliveryProcessor extends WorkerHost {
  private readonly logger = new Logger(DeliveryProcessor.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customersRepo: Repository<Customer>,
    @InjectRepository(DeliveryAttempt)
    private readonly attemptsRepo: Repository<DeliveryAttempt>,
    private readonly http: HttpService,
  ) {
    super();
  }

  async process(job: Job<DeliverWebhookJobData>): Promise<void> {
    const { eventId, customerId, eventType, payload } = job.data;

    const customer = await this.customersRepo.findOneBy({ id: customerId });
    if (!customer) {
      this.logger.error(`Customer ${customerId} not found — dropping job`);
      return;
    }

    const attemptNumber = job.attemptsMade + 1;
    const bodyString = JSON.stringify({ eventId, type: eventType, payload });
    const signature = signPayload(bodyString, customer.secret);

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.http.post(customer.webhookUrl, bodyString, {
          headers: {
            'Content-Type': 'application/json',
            'X-Event-Id': eventId,
            'X-Customer-Id': customerId,
            'X-Webhook-Signature': signature,
          },
          timeout: 5000,
        }),
      );

      await this.attemptsRepo.save(
        this.attemptsRepo.create({
          eventId,
          customerId,
          attemptNumber,
          status: DeliveryStatus.DELIVERED,
          responseCode: response.status,
          error: null,
        }),
      );

      this.logger.log(
        `Delivered event ${eventId} to ${customer.name} (attempt ${attemptNumber}, status ${response.status})`,
      );
    } catch (err: any) {
      const responseCode = err.response?.status ?? null;
      const errorMessage = err.message ?? 'Unknown error';
      const isLastAttempt = attemptNumber >= (job.opts.attempts ?? 1);

      await this.attemptsRepo.save(
        this.attemptsRepo.create({
          eventId,
          customerId,
          attemptNumber,
          status: isLastAttempt ? DeliveryStatus.DEAD : DeliveryStatus.RETRYING,
          responseCode,
          error: errorMessage,
        }),
      );

      if (isLastAttempt) {
        this.logger.error(
          `Delivery permanently failed for event ${eventId} to ${customer.name} after ${attemptNumber} attempts — moving to DLQ`,
        );
      } else {
        this.logger.warn(
          `Delivery failed for event ${eventId} to ${customer.name} (attempt ${attemptNumber}/${job.opts.attempts}): ${errorMessage}`,
        );
      }

      throw err;
    }
  }
}

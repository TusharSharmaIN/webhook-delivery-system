import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';

const SAMPLE_EVENT_TYPES = ['order.created', 'user.signup', 'payment.failed'];

@Injectable()
export class EventProducerService implements OnModuleInit {
  private readonly logger = new Logger(EventProducerService.name);
  private readonly coreApiUrl: string;
  private readonly intervalMs: number;
  private paused = false;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.coreApiUrl = this.config.get('CORE_API_URL', 'http://core-api:3000');
    this.intervalMs = Number(this.config.get('EVENT_INTERVAL_MS', 10000));
  }

  onModuleInit() {
    this.logger.log(
      `Event producer starting: firing an event every ${this.intervalMs}ms to ${this.coreApiUrl}`,
    );
    const interval = setInterval(() => this.fireRandomEvent(), this.intervalMs);
    this.schedulerRegistry.addInterval('event-producer-tick', interval);
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    this.logger.log(paused ? 'Auto-firing paused' : 'Auto-firing resumed');
  }

  isPaused(): boolean {
    return this.paused;
  }

  async fireRandomEvent() {
    if (this.paused) return;

    const type =
      SAMPLE_EVENT_TYPES[Math.floor(Math.random() * SAMPLE_EVENT_TYPES.length)];
    const payload = this.buildPayload(type);

    try {
      const response = await firstValueFrom(
        this.http.post(`${this.coreApiUrl}/events`, { type, payload }),
      );
      this.logger.log(
        `Fired ${type} -> enqueued ${response.data.enqueuedJobs} job(s)`,
      );
    } catch (err: any) {
      this.logger.error(`Failed to fire event: ${err.message}`);
    }
  }

  private buildPayload(type: string): Record<string, any> {
    switch (type) {
      case 'order.created':
        return {
          orderId: randomUUID(),
          amount: Math.round(Math.random() * 10000) / 100,
        };
      case 'user.signup':
        return { userId: randomUUID(), email: `user${Date.now()}@example.com` };
      case 'payment.failed':
        return { paymentId: randomUUID(), reason: 'insufficient_funds' };
      default:
        return {};
    }
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import {
  DeliveryAttempt,
  DeliveryStatus,
} from '../delivery-attempts/delivery-attempt.entity';

@ApiTags('dead-letter')
@Controller('dead-letter')
export class DeadLetterController {
  constructor(
    @InjectQueue('delivery') private readonly deliveryQueue: Queue,
    @InjectRepository(DeliveryAttempt)
    private readonly attemptsRepo: Repository<DeliveryAttempt>,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'List permanently failed deliveries (exhausted all retry attempts)',
  })
  async listDeadLetters() {
    // Our own audit log is the source of truth for "permanently dead" —
    // BullMQ's internal failed-job set is a secondary/raw view of the same thing.
    const deadAttempts = await this.attemptsRepo.find({
      where: { status: DeliveryStatus.DEAD },
      relations: { event: true, customer: true },
      order: { attemptedAt: 'DESC' },
    });

    return deadAttempts.map((attempt) => ({
      eventId: attempt.eventId,
      eventType: attempt.event.type,
      customerName: attempt.customer.name,
      finalAttemptNumber: attempt.attemptNumber,
      lastResponseCode: attempt.responseCode,
      lastError: attempt.error,
      diedAt: attempt.attemptedAt,
    }));
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Basic delivery statistics across all events' })
  async getStats() {
    const [total, delivered, retrying, dead] = await Promise.all([
      this.attemptsRepo.count(),
      this.attemptsRepo.count({ where: { status: DeliveryStatus.DELIVERED } }),
      this.attemptsRepo.count({ where: { status: DeliveryStatus.RETRYING } }),
      this.attemptsRepo.count({ where: { status: DeliveryStatus.DEAD } }),
    ]);

    return {
      totalAttempts: total,
      delivered,
      retrying,
      dead,
      successRate:
        total > 0 ? Math.round((delivered / total) * 10000) / 100 : 0,
    };
  }

  @Get(':eventId/history')
  @ApiOperation({ summary: 'Full delivery attempt history for one event' })
  async getHistory(@Param('eventId') eventId: string) {
    return this.attemptsRepo.find({
      where: { eventId },
      order: { attemptNumber: 'ASC' },
    });
  }

  @Get('raw/bullmq')
  @ApiOperation({
    summary:
      'Raw BullMQ failed-job set (low-level view, for debugging the queue itself)',
  })
  async getRawFailedJobs() {
    const failedJobs = await this.deliveryQueue.getFailed();
    return failedJobs.map((job) => ({
      jobId: job.id,
      data: job.data,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      timestamp: job.timestamp,
    }));
  }
}

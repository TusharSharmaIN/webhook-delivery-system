import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { Event } from './event.entity';
import { Subscription } from '../subscriptions/subscription.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepo: Repository<Subscription>,
    @InjectQueue('delivery')
    private readonly deliveryQueue: Queue,
  ) {}

  async create(type: string, payload: Record<string, any>) {
    const event = this.eventsRepo.create({ type, payload });
    const saved = await this.eventsRepo.save(event);

    const matchingSubscriptions = await this.subscriptionsRepo.find({
      where: { eventType: type },
      relations: { customer: true },
    });

    const jobs = await Promise.all(
      matchingSubscriptions.map((sub) =>
        this.deliveryQueue.add(
          'deliver-webhook',
          {
            eventId: saved.id,
            customerId: sub.customerId,
            eventType: saved.type,
            payload: saved.payload,
          },
          {
            attempts: 3,
            backoff: { type: 'custom' },
          },
        ),
      ),
    );

    return {
      event: saved,
      enqueuedJobs: jobs.length,
      deliveringTo: matchingSubscriptions.map((s) => s.customer.name),
    };
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepo.find();
  }

  async findOne(id: string): Promise<Event | null> {
    return this.eventsRepo.findOneBy({ id });
  }
}

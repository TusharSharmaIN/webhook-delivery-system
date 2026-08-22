import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Subscription } from '../subscriptions/subscription.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepo: Repository<Subscription>,
  ) {}

  async create(type: string, payload: Record<string, any>) {
    const event = this.eventsRepo.create({ type, payload });
    const saved = await this.eventsRepo.save(event);

    const matchingSubscriptions = await this.subscriptionsRepo.find({
      where: { eventType: type },
      relations: { customer: true },
    });

    // Phase 3 will enqueue a BullMQ delivery job per match here.
    // For now, just report what would be delivered.
    return {
      event: saved,
      matchedSubscriptions: matchingSubscriptions.length,
      wouldDeliverTo: matchingSubscriptions.map((s) => s.customer.name),
    };
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepo.find();
  }

  async findOne(id: string): Promise<Event | null> {
    return this.eventsRepo.findOneBy({ id });
  }
}

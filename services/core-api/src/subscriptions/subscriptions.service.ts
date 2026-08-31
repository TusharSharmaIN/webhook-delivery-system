import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Customer } from '../customers/customer.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepo: Repository<Subscription>,
    @InjectRepository(Customer)
    private readonly customersRepo: Repository<Customer>,
  ) {}

  async create(customerId: string, eventType: string): Promise<Subscription> {
    const customer = await this.customersRepo.findOneBy({ id: customerId });
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }
    const subscription = this.subscriptionsRepo.create({
      customerId,
      eventType,
    });
    try {
      return await this.subscriptionsRepo.save(subscription);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === '23505') {
        throw new ConflictException(
          `${customer.name} is already subscribed to ${eventType}`,
        );
      }
      throw err;
    }
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionsRepo.find({ relations: { customer: true } });
  }

  async findByEventType(eventType: string): Promise<Subscription[]> {
    return this.subscriptionsRepo.find({
      where: { eventType },
      relations: { customer: true },
    });
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.subscriptionsRepo.delete(id);
    return { deleted: (result.affected ?? 0) > 0 };
  }
}

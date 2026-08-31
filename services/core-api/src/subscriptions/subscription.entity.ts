import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Customer } from '../customers/customer.entity';

@Entity('subscriptions')
@Unique(['customerId', 'eventType'])
export class Subscription {
  @PrimaryColumn('uuid', { default: () => 'gen_random_uuid()' })
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'event_type' })
  eventType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

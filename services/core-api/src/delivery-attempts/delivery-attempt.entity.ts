import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { Customer } from '../customers/customer.entity';

export enum DeliveryStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  RETRYING = 'retrying',
  DEAD = 'dead',
}

@Entity('delivery_attempts')
export class DeliveryAttempt {
  @PrimaryColumn('uuid', { default: () => 'gen_random_uuid()' })
  id: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'attempt_number', type: 'int' })
  attemptNumber: number;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ name: 'response_code', type: 'int', nullable: true })
  responseCode: number | null;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @CreateDateColumn({ name: 'attempted_at' })
  attemptedAt: Date;
}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryAttempt } from '../delivery-attempts/delivery-attempt.entity';
import { Event } from '../events/event.entity';
import { Customer } from '../customers/customer.entity';
import { DeadLetterController } from './dead-letter.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'delivery' }),
    TypeOrmModule.forFeature([DeliveryAttempt, Event, Customer]),
  ],
  controllers: [DeadLetterController],
})
export class DeadLetterModule {}

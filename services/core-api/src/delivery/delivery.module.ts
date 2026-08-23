import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { HttpModule } from '@nestjs/axios';
import { Customer } from '../customers/customer.entity';
import { DeliveryAttempt } from '../delivery-attempts/delivery-attempt.entity';
import { DeliveryProcessor } from './delivery.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, DeliveryAttempt]),
    BullModule.registerQueue({ name: 'delivery' }),
    HttpModule,
  ],
  providers: [DeliveryProcessor],
})
export class DeliveryModule {}

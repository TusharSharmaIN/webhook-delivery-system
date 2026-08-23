import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Event } from './event.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Subscription]),
    BullModule.registerQueue({
      name: 'delivery',
    }),
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}

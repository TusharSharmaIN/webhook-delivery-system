import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Subscription])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}

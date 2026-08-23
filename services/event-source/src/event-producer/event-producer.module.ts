import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventProducerService } from './event-producer.service';

@Module({
  imports: [HttpModule],
  providers: [EventProducerService],
})
export class EventProducerModule {}

import { Module } from '@nestjs/common';
import { EventProducerService } from './event-producer.service';
import { EventProducerController } from './event-producer.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EventProducerService],
  controllers: [EventProducerController],
})
export class EventProducerModule {}

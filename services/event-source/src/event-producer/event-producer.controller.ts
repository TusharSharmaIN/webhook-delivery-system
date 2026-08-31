import { Controller, Get, Post } from '@nestjs/common';
import { EventProducerService } from './event-producer.service';

@Controller('producer')
export class EventProducerController {
  constructor(private readonly producer: EventProducerService) {}

  @Get()
  getStatus() {
    return { paused: this.producer.isPaused() };
  }

  @Post('pause')
  pause() {
    this.producer.setPaused(true);
    return { paused: true };
  }

  @Post('resume')
  resume() {
    this.producer.setPaused(false);
    return { paused: false };
  }
}

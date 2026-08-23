import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { EventProducerModule } from './event-producer/event-producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    HttpModule,
    HealthModule,
    EventProducerModule,
  ],
})
export class AppModule {}

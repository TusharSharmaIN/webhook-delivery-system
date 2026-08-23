import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { ConfigModule as ReceiverConfigModule } from './config/config.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    ReceiverConfigModule,
    WebhooksModule,
  ],
})
export class AppModule {}

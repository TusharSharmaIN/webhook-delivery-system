import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { EventsModule } from './events/events.module';
import { BullModule } from '@nestjs/bullmq';
import { DeliveryModule } from './delivery/delivery.module';
import { DeadLetterModule } from './dead-letter/dead-letter.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true, singleLine: true },
              }
            : undefined, // in production, emit raw JSON logs — pretty-printing is a dev convenience only
        level: process.env.LOG_LEVEL || 'info',
        redact: ['req.headers.authorization'], // never log secrets/tokens, even by accident
        autoLogging: {
          ignore: (req) => req.url === '/health', // don't spam logs with health check pings
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL');
        return {
          connection: redisUrl
            ? { url: redisUrl } // production: Upstash, single URL
            : {
                host: config.get('REDIS_HOST', 'redis'),
                port: Number(config.get('REDIS_PORT', 6379)),
              }, // local Docker
          prefix: 'whs', // namespaces every key as whs:* — safe to share Redis with other projects
        };
      },
    }),
    HealthModule,
    CustomersModule,
    SubscriptionsModule,
    EventsModule,
    DeliveryModule,
    DeadLetterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

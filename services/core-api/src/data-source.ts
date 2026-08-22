import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Customer } from './customers/customer.entity';
import { Subscription } from './subscriptions/subscription.entity';
import { Event } from './events/event.entity';
import { DeliveryAttempt } from './delivery-attempts/delivery-attempt.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'webhook',
  password: process.env.DB_PASSWORD || 'webhook',
  database: process.env.DB_NAME || 'webhook_delivery',
  entities: [Customer, Subscription, Event, DeliveryAttempt],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

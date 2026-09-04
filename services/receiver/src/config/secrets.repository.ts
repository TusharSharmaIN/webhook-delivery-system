import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SecretsRepository implements OnModuleInit {
  private pool: Pool;

  constructor() {
    const isRemote = process.env.DB_HOST?.includes('neon.tech');
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'webhook',
      password: process.env.DB_PASSWORD || 'webhook',
      database: process.env.DB_NAME || 'webhook_delivery',
      ssl: isRemote ? { rejectUnauthorized: false } : false,
    });
  }

  async onModuleInit() {
    // Simple "create if missing" — no migrations needed for one small table.
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS receiver_secrets (
        customer_id TEXT PRIMARY KEY,
        secret TEXT NOT NULL
      )
    `);
  }

  async setSecret(customerId: string, secret: string): Promise<void> {
    await this.pool.query(
      `INSERT INTO receiver_secrets (customer_id, secret)
       VALUES ($1, $2)
       ON CONFLICT (customer_id) DO UPDATE SET secret = $2`,
      [customerId, secret],
    );
  }

  async getSecret(customerId: string): Promise<string | null> {
    const result = await this.pool.query(
      `SELECT secret FROM receiver_secrets WHERE customer_id = $1`,
      [customerId],
    );
    return result.rows[0]?.secret ?? null;
  }

  async countKnown(): Promise<number> {
    const result = await this.pool.query(
      `SELECT COUNT(*) FROM receiver_secrets`,
    );
    return parseInt(result.rows[0].count, 10);
  }
}

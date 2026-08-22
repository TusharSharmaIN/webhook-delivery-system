import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryColumn('uuid', { default: () => 'gen_random_uuid()' })
  id: string;

  @Column()
  name: string;

  @Column({ name: 'webhook_url' })
  webhookUrl: string;

  @Column()
  secret: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

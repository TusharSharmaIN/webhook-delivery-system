import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepo: Repository<Customer>,
  ) {}

  async create(name: string, webhookUrl: string): Promise<Customer> {
    const secret = randomBytes(32).toString('hex');
    const customer = this.customersRepo.create({ name, webhookUrl, secret });
    return this.customersRepo.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customersRepo.find();
  }

  async findOne(id: string): Promise<Customer | null> {
    return this.customersRepo.findOneBy({ id });
  }
}

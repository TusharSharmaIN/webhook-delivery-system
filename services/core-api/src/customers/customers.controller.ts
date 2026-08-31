import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new customer (webhook subscriber)' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto.name, dto.webhookUrl);
  }

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single customer by id' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a customer and all their subscriptions/delivery history',
  })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}

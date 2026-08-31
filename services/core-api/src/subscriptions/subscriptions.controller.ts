import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Subscribe a customer to an event type' })
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(dto.customerId, dto.eventType);
  }

  @Get()
  @ApiOperation({
    summary: 'List subscriptions, optionally filtered by eventType',
  })
  @ApiQuery({ name: 'eventType', required: false })
  findAll(@Query('eventType') eventType?: string) {
    return eventType
      ? this.subscriptionsService.findByEventType(eventType)
      : this.subscriptionsService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a subscription' })
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }
}

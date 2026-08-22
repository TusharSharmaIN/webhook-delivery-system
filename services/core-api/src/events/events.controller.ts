import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({
    summary: 'Record a new event and report matching subscriptions',
  })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto.type, dto.payload);
  }

  @Get()
  @ApiOperation({ summary: 'List all events' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event by id' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}

import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';

import { Event } from './event.entity';

import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  private events: Event[] = [];

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const event = this.events.find((event) => event.id === +id);

    return event;
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    const event = {
      id: this.events.length + 1,
      ...input,
      when: new Date(input.when),
    };

    this.events.push(event);

    return event;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const index = this.events.findIndex((event) => event.id === +id);

    this.events[index] = {
      ...this.events[index],
      ...input,
      when: input.when ? new Date(input.when) : this.events[index].when,
    };

    return this.events[index];
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.events = this.events.filter((event) => event.id !== +id);
  }
}

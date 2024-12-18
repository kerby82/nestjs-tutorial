import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { Repository, MoreThan, Like } from 'typeorm';

import { Event } from './event.entity';

import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>
  ) {}

  private events: Event[] = [];

  @Get()
  async findAll() {
    return this.repository.find();
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
      select: ['id', 'when', 'name'],
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.repository.findOneBy({ id: +id });
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      id: this.events.length + 1,
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOneBy({ id: +id });

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event?.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const event = await this.repository.findOneBy({ id: +id });
    await this.repository.remove(event);
  }
}

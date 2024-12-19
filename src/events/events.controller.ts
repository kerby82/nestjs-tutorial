import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
  ValidationPipe,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository, MoreThan, Like, Not } from 'typeorm';

import { Event } from './event.entity';

import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  private events: Event[] = [];

  @Get()
  async findAll() {
    this.logger.log('Hit the events endpoint');
    const events = this.repository.find();
    this.logger.debug(`Retrieved events: ${(await events).length}`);

    return events;
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

  @Get('/practice2')
  async practice2() {
    return await this.repository.find({
      where: {
        id: Not(2),
      },
      relations: ['attendees'],
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.repository.findOneBy({ id: id });

    if (!event) {
      this.logger.debug(`Event with ID ${id} not found`);
      throw new NotFoundException();
    }

    this.logger.debug(`Retrieved event with ID ${id}`);

    return event;
  }

  @Post()
  async create(@Body(ValidationPipe) input: CreateEventDto) {
    return await this.repository.save({
      id: this.events.length + 1,
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOneBy({ id: +id });

    if (!event) {
      this.logger.debug(`Event with ID ${id} not found`);
      throw new NotFoundException();
    }

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

    if (!event) {
      this.logger.debug(`Event with ID ${id} not found`);
      throw new NotFoundException();
    }

    await this.repository.remove(event);
  }
}

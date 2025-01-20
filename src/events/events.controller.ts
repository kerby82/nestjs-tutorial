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
  UsePipes,
  Logger,
  NotFoundException,
  Query,
  ForbiddenException,
  SerializeOptions,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Repository, MoreThan, Like, Not } from 'typeorm';

import { Event } from './event.entity';

import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../auth/user.entity';
import { AuthGuardJwt } from './../auth/auth-guard.jwt';
import { UseGuards } from '@nestjs/common';

@Controller('/events')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    private readonly eventsService: EventsService,
  ) {}

  private events: Event[] = [];

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug('Filter is: ' + JSON.stringify(filter));
    this.logger.log('Hit the events endpoint');
    const paginationOptions = {
      limit: 2,
      currentPage: filter.page,
      total: true,
    };
    const events =
      this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        paginationOptions,
      );
    this.logger.debug(`Retrieved events: ${(await events).total}`);

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

  @Get('/practice3')
  async practice3() {
    return await this.repository
      .createQueryBuilder('e')
      .select(['e.id', 'e.name'])
      .orderBy('e.id', 'DESC')
      .take(2)
      .getMany();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEventWithAttendeeCount(id);

    if (!event) {
      this.logger.debug(`Event with ID ${id} not found`);
      throw new NotFoundException();
    }

    this.logger.debug(`Retrieved event with ID ${id}`);

    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body(ValidationPipe) input: CreateEventDto,
    @CurrentUser() user: User,
  ) {
    this.logger.debug(`User ${user.id} is creating an event`);
    this.logger.debug(`Creating event with data: ${JSON.stringify(input)}`);
    return await this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.getEventWithAttendeeCount(+id);

    if (!event) {
      this.logger.debug(`Event with ID ${id} not found`);
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      this.logger.debug(
        `User ${user.id} is not the organizer of event with ID ${id}`,
      );
      throw new ForbiddenException(
        null,
        'You are not the organizer of this event',
      );
    }

    return await this.eventsService.updateEvent(event, input);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param('id', ParseIntPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOne(+id);

    if (!event) {
      this.logger.debug(`Event with ID ${id} not found`);
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      this.logger.debug(
        `User ${user.id} is not the organizer of event with ID ${id}`,
      );
      throw new ForbiddenException(
        null,
        'You are not the organizer of this event',
      );
    }

    return await this.eventsService.deleteEvent(+id);
  }
}

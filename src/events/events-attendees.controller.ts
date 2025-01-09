import {
  ClassSerializerInterceptor,
  Controller,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsAttendeesController {
  private logger = new Logger(EventsAttendeesController.name);
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId') eventId: number) {
    this.logger.debug(`Retrieving attendees for event with ID: ${eventId}`);
    return this.attendeesService.findByEventId(eventId);
  }
}

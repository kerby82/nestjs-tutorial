import {
  ClassSerializerInterceptor,
  Controller,
  SerializeOptions,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Param, Query } from '@nestjs/common';

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('userId') userId: number, @Query('page') page = 1) {
    return this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
      currentPage: page,
      limit: 5,
    });
  }
}

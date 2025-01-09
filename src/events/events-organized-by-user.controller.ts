import {
  ClassSerializerInterceptor,
  Controller,
  SerializeOptions,
  Get,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Param, Query, DefaultValuePipe } from '@nestjs/common';

@Controller('events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
      currentPage: page,
      limit: 5,
    });
  }
}

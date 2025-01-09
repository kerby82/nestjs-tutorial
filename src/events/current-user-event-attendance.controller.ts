import {
  ClassSerializerInterceptor,
  Controller,
  ParseIntPipe,
  SerializeOptions,
  NotFoundException,
} from '@nestjs/common';
import { Put, Param, Body, UseGuards, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { EventsService } from './events.service';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './input/create-attendee.dto';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { UseInterceptors } from '@nestjs/common';

@Controller('events-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesService: AttendeesService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@CurrentUser() user: User, @Query('page') page = 1) {
    return await this.eventsService.getEventsAttendedByUserIdPaginated(
      user.id,
      { limit: 10, currentPage: page },
    );
  }

  @Get('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const attendee = await this.attendeesService.findOneByEventIdAndUserId(
      eventId,
      user.id,
    );

    if (!attendee) {
      throw new NotFoundException();
    }

    return attendee;
  }

  @Put('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    return await this.attendeesService.createOrUpdate(input, eventId, user.id);
  }
}

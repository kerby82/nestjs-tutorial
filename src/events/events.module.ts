import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsAttendeesController } from './events-attendees.controller';
import { AttendeesService } from './attendees.service';
import { Attendee } from './attendee.entity';

@Module({
  // forFeature() is used to define which repositories are registered in the current scope
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController, EventsAttendeesController],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}

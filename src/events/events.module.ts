import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';

@Module({
  // forFeature() is used to define which repositories are registered in the current scope
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [],
})
export class EventsModule {}

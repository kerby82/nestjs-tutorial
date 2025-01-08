import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AttendeeAnswerEnum } from './attendee.entity';
import { ListEvents } from './input/list.events';
import { WhenEventFilter } from './input/list.events';
import { PaginateOptions, paginate } from '../pagination/paginator';
import { DeleteResult } from 'typeorm';
import { CreateEventDto } from './input/create-event.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = await this.getEventsWithAttendeesCountQuery().where(
      'e.id = :id',
      { id },
    );
    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  public getEventsWithAttendeesCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeesCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.andWhere('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.andWhere('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.andWhere('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      );
  }

  private getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventsWithAttendeesCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(`e.when BETWEEN :start AND :end`, {
          start: today.toISOString().split('T')[0],
          end: tomorrow.toISOString().split('T')[0],
        });
      }

      if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere(`e.when BETWEEN :start AND :end`, {
          start: tomorrow.toISOString().split('T')[0],
          end: nextWeek.toISOString().split('T')[0],
        });
      }

      if (filter.when == WhenEventFilter.ThisWeek) {
        const startOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay()),
        );
        const endOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay() + 6),
        );
        query = query.andWhere(`e.when BETWEEN :start AND :end`, {
          start: startOfWeek.toISOString().split('T')[0],
          end: endOfWeek.toISOString().split('T')[0],
        });
      }

      if (filter.when == WhenEventFilter.NextWeek) {
        const startOfNextWeek = new Date(
          nextWeek.setDate(nextWeek.getDate() - nextWeek.getDay()),
        );
        const endOfNextWeek = new Date(
          nextWeek.setDate(nextWeek.getDate() - nextWeek.getDay() + 6),
        );
        query = query.andWhere(`e.when BETWEEN :start AND :end`, {
          start: startOfNextWeek.toISOString().split('T')[0],
          end: endOfNextWeek.toISOString().split('T')[0],
        });
      }
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventRepository
      .createQueryBuilder('e')
      .delete()
      .where('e.id = :id', { id })
      .execute();
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return await this.eventRepository.save({
      ...input,
      organizer: user,
      when: new Date(input.when),
    });
  }
}

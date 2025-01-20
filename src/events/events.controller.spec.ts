import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;
  let eventsRepository: Repository<Event>;

  beforeAll(() => {
    console.log('Before all tests');
  });

  beforeEach(async () => {
    eventsService = new EventsService(eventsRepository);
    eventsController = new EventsController(eventsRepository, eventsService);
  });

  it('should return a list of events', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      data: [],
    };

    // eventsService.getEventsWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation((): any => result);

    const spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);

    expect(spy).not.toHaveBeenCalled();
    expect(await eventsController.findAll(new ListEvents())).toEqual(result);
    expect(spy).toBeCalledTimes(1);
  });

  it('should not delete an event when it is not found', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');

    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation(() => {
        return undefined;
      });

    try {
      await eventsController.remove('1', new User());
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    expect(deleteSpy).not.toHaveBeenCalled();
    expect(findSpy).toBeCalledTimes(1);
  });
});

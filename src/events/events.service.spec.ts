import { EventsService } from './events.service';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce({ id: 1 } as Event);

      expect(
        service.updateEvent(new Event({ id: 1 }), {
          name: 'Event Name',
        }),
      ).resolves.toEqual({ id: 1 });

      expect(repoSpy).toBeCalledWith({ id: 1, name: 'Event Name' });
    });
  });
});

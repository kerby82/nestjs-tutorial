import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';

export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeesRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    return this.attendeesRepository.find({
      where: { eventId },
    });
  }
}

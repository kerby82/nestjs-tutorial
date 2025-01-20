import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from './../auth/user.entity';
import { Expose } from 'class-transformer';
import { PaginationResults } from './../pagination/paginator';

@Entity('events')
export class Event {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn() // auto-incrementing primary key
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  when: Date;

  @Column()
  @Expose()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    eager: true,
  })
  @Expose()
  attendees: Attendee[];

  @Expose()
  attendeesCount?: number;

  @Expose()
  attendeeRejected?: number;

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;
}

export type PaginatedEvents = PaginationResults<Event>;

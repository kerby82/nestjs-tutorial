import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn() // auto-incrementing primary key
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  when: Date;
  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    eager: true,
  })
  attendees: Attendee[];
  attendeesCount?: number;
  attendeeRejected?: number;
  attendeeAccepted?: number;
  attendeeMaybe?: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from '../auth/user.entity';
import { Expose } from 'class-transformer';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe = 0,
  Rejected = -1,
}

@Entity('attendees')
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event: Event;

  @Column({ name: 'event_id' })
  eventId: number;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended, { nullable: false })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;
}

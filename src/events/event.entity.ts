import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from 'src/auth/user.entity';
import { Expose } from 'class-transformer';

@Entity('events')
export class Event {
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

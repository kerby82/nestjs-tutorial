import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Event } from '../events/event.entity';
import { Expose } from 'class-transformer';
import { Attendee } from '../events/attendee.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @Column()
  password: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => Event, (event) => event.organizer)
  organized: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attended: Attendee[];
}

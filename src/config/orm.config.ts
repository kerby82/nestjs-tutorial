import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { registerAs } from '@nestjs/config';
import { Attendee } from './../events/attendee.entity';
import { User } from './../auth/user.entity';
import { Profile } from './../auth/profile.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, User, Profile],
    synchronize: true,
    dropSchema: Boolean(process.env.DB_DROP_SCHEMA),
  }),
);

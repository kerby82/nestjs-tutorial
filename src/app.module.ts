import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { Event } from './events/event.entity';
import { AppJapanService } from './app.japan.service';
import { AppDummy } from './app.dummy';

@Module({
  imports: [
    // forRoot() is used to configure a dynamic module
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'nest-events',
      entities: [Event],
      synchronize: true,
    }),
    EventsModule, // this does the same as the entities array in the TypeOrmModule.forRoot() call
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppJapanService,
    },
    {
      provide: 'APP_NAME',
      useValue: 'Nest Events',
    },
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app: AppDummy) => `${app.dummy()} Factory!`,
    },
    AppDummy,
  ],
})
export class AppModule {}

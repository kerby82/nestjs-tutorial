import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { AppJapanService } from './app.japan.service';
import { AppDummy } from './app.dummy';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // global to all modules
      envFilePath: '.env',
      load: [ormConfig],
      expandVariables: true,
    }), // this is used to load the .env file
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? ormConfigProd : ormConfig,
    }), // this is used to connect to the database
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

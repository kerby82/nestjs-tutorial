import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
let app: INestApplication;
let mode: TestingModule;

describe('Events (e2e)', () => {
  beforeAll(async () => {
    mode = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = mode.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return empty list', () => {
    return request(app.getHttpServer()).get('/events').expect(200);
  });
});

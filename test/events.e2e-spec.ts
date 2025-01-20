import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { Connection } from 'typeorm';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

let app: INestApplication;
let mode: TestingModule;
let connection: Connection;

const loadFixtures = async (sqlFileName: string) => {
  const sql = fs.readFileSync(
    path.join(__dirname, 'fixtures', sqlFileName),
    'utf8',
  );
  const queryRunner = connection.createQueryRunner('master');

  for (const c of sql.split(';')) {
    await queryRunner.query(c);
  }
};

describe('Events (e2e)', () => {
  beforeAll(async () => {
    mode = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = mode.createNestApplication();
    await app.init();

    connection = app.get(Connection);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return empty list', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBe(0);
      });
  });

  it('should return a single event', async () => {
    await loadFixtures('1-event-1-user.sql');

    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .then((response) => {
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('Interesting Party');
      });
  });
});

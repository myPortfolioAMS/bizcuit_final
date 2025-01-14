import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Tasks Endpoint (e2e)', () => {
  let authToken: string;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test_user_X',
        password: 'test_password_X',
      });

    authToken = loginResponse.body.accessToken;
    console.log('Login Response:', loginResponse.body);
    console.log('Status Code:', loginResponse.status);
  });

  it('/tasks (POST) should create a new task', async () => {
    const newTask = {
      title: 'Test Task - Write unit tests with login',
      description: 'Test Task Write unit tests for the new feature with login',
      dueDate: '2024-12-01T00:00:00.000Z',
      completed: false,
    };

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newTask)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: 'Test Task - Write unit tests with login',
      description: 'Test Task Write unit tests for the new feature with login',
      dueDate: '2024-12-01T00:00:00.000Z',
      completed: false,
      user: 5,
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

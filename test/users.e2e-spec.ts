/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { User } from '../src/users/entities';
import { CreateUserDto, UpdateUserDto, UserDto } from '../src/users/dto';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../src/users/models';

const usersData: CreateUserDto[] = [
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'password1',
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    password: 'password2',
  },
];
describe('UserController (e2e)', () => {
  let context: TestHelper;
  let commonAccessToken: string;
  let querySpy: jest.SpyInstance;
  let executeSpy: jest.SpyInstance;

  beforeAll(async () => {
    context = await TestHelper.initTestApp();
    const conn = context.db;
    querySpy = jest.spyOn(conn, 'query');
    executeSpy = jest.spyOn(conn, 'execute');
  });

  afterAll(async () => {
    await context.closeTestApp();
    querySpy.mockRestore();
    executeSpy.mockRestore();
  });

  beforeEach(async () => {
    commonAccessToken = context.generateAccessToken({
      id: 1,
      email: 'user1@example.com',
    });
    await context.resetTestApp();
    querySpy.mockClear();
    executeSpy.mockClear();
  });

  const loadDummyUsers = async (): Promise<User[]> => {
    const dummyData = usersData.map((u) => [u.username, u.email, u.password]);

    await context.db.query(
      'INSERT INTO users (username, email, password) VALUES ?',
      [dummyData],
    );

    const [rows] = await context.db.query<UserModel[]>('SELECT * FROM users', [
      dummyData,
    ]);

    return rows;
  };

  describe('GET /users', () => {
    it('should return an empty array when no users exist', async () => {
      return await request(context.app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200)
        .expect([]);
    });

    it('should return all users', async () => {
      await loadDummyUsers();

      const response = await request(context.app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);
      const responseBody = response.body as UserDto[];

      expect(responseBody).toHaveLength(2);
      expect(responseBody[0]?.username).toBe('user1');
      expect(responseBody[1]?.username).toBe('user2');
      expect(responseBody[0]).not.toHaveProperty('password');
      expect(responseBody[1]).not.toHaveProperty('password');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const dummyUsers: User[] = await loadDummyUsers();
      const firstUser = dummyUsers[0];
      const response = await request(context.app.getHttpServer())
        .get(`/users/${firstUser.id}`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);

      const responseBody = response.body as UserDto;
      expect(responseBody.id).toBe(firstUser.id);
      expect(responseBody.email).toEqual(firstUser.email);
      expect(responseBody.username).toEqual(firstUser.username);
    });

    it('should throw Not Found Expection when user does not exist', async () => {
      const id = 99;
      const response = await request(context.app.getHttpServer())
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: `User with ID ${id} not found`,
        error: 'Not Found',
      });
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser: CreateUserDto = {
        username: 'newUser',
        email: 'newUser@example.com',
        password: 'password1',
      };

      const response = await request(context.app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201);

      const responseBody = response.body as UserDto;
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.username).toBe(newUser.username);
      expect(responseBody.email).toBe(newUser.email);
      expect(responseBody).not.toHaveProperty('password');
    });

    it('should throw Bad Request Exception when there are missing fields', async () => {
      const newUser = {
        username: 'newUser',
        email: 'newUser@example.com',
      };

      await request(context.app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(400);

      expect(executeSpy).not.toHaveBeenCalled();
    });

    it('should throw Bad Request Exception when email is not valid', async () => {
      const newUser = {
        username: 'newUser',
        email: 'not-an-email',
        password: 'password1',
      };

      const response = await request(context.app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
      expect(executeSpy).not.toHaveBeenCalled();
    });

    it('should throw Bad Request Exception when password is too short', async () => {
      const newUser: CreateUserDto = {
        username: 'newUser',
        email: 'newUser@example.com',
        password: 'short',
      };

      const response = await request(context.app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: ['password must be longer than or equal to 8 characters'],
        error: 'Bad Request',
      });
      expect(executeSpy).not.toHaveBeenCalled();
    });

    it('should throw error an email already exists', async () => {
      const dummyUsers: User[] = await loadDummyUsers();
      const firstUser = dummyUsers[0];
      const newUser: CreateUserDto = {
        username: 'newUser',
        email: firstUser.email,
        password: 'password1',
      };

      const response = await request(context.app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: `Duplicate entry '${firstUser.email}' for key 'users.email'`,
        error: 'Bad Request',
      });
      expect(executeSpy).toHaveBeenCalled();
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user email', async () => {
      const dummyUsers: User[] = await loadDummyUsers();
      const firstUser = dummyUsers[0];
      const updateData: UpdateUserDto = {
        email: 'newUser@example.com',
      };

      const response = await request(context.app.getHttpServer())
        .patch(`/users/${firstUser.id}`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(updateData)
        .expect(200);

      const responseBody = response.body as UserDto;
      expect(responseBody.id).toBe(firstUser.id);
      expect(responseBody.email).toBe(updateData.email);
      expect(responseBody.username).toBe(firstUser.username);
      expect(responseBody).not.toHaveProperty('password');

      const [rows] = await context.db.execute<UserModel[]>(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [firstUser.id],
      );
      const userInDb = rows && rows.length > 0 ? rows[0] : null;
      expect(userInDb?.email).toBe(updateData.email);
    });

    it('should throw Not Found Expection when user does not exist', async () => {
      await loadDummyUsers();
      const updateData: UpdateUserDto = {
        email: 'newUser@example.com',
      };
      const id = 99;

      const response = await request(context.app.getHttpServer())
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: `User with ID ${id} not found`,
        error: 'Not Found',
      });
    });

    it('should throw Bad Request Expection when there are unknown fields', async () => {
      const updateData = {
        randomField: 27,
      };

      const response = await request(context.app.getHttpServer())
        .patch(`/users/1`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: ['property randomField should not exist'],
        error: 'Bad Request',
      });
      expect(executeSpy).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by ID', async () => {
      const dummyUsers: User[] = await loadDummyUsers();
      const firstUser = dummyUsers[0];

      await request(context.app.getHttpServer())
        .delete(`/users/${firstUser.id}`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(204);

      const [rows] = await context.db.execute<UserModel[]>(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [firstUser.id],
      );
      const userInDb = rows && rows.length > 0 ? rows[0] : null;
      expect(userInDb).toBeNull();
    });

    it('should throw Not Found Expection when user does not exist', async () => {
      await loadDummyUsers();
      const id = 99;

      const response = await request(context.app.getHttpServer())
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: `User with ID ${id} not found`,
        error: 'Not Found',
      });
    });
  });
});

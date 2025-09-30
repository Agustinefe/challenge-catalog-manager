import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { JwtService } from '@nestjs/jwt';
import { UserSessionRepository } from '../src/auth/user-session.repository';
import { UsersRepository } from '../src/users/users.repository';

describe('ProductsController (e2e)', () => {
  let context: TestHelper;

  let authSaveSpy: jest.SpyInstance;
  let userFindByEmailSpy: jest.SpyInstance;
  let authDeleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    context = await TestHelper.initTestApp();
    authSaveSpy = jest.spyOn(context.app.get(UserSessionRepository), 'create');
    authDeleteSpy = jest.spyOn(
      context.app.get(UserSessionRepository),
      'deleteByToken',
    );
    userFindByEmailSpy = jest.spyOn(
      context.app.get(UsersRepository),
      'findByEmail',
    );
  });

  afterAll(async () => {
    await context.closeTestApp();
    authSaveSpy.mockRestore();
    userFindByEmailSpy.mockRestore();
    authDeleteSpy.mockRestore();
  });

  beforeEach(async () => {
    await context.resetTestApp();
    authSaveSpy.mockClear();
    userFindByEmailSpy.mockClear();
    authDeleteSpy.mockClear();
  });
});

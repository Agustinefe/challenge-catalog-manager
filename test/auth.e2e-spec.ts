/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { User } from '../src/users/entities';
import { CreateUserDto } from '../src/users/dto';
import { EncryptService } from '../src/common/encrypt.service';
import { SigninBodyDto } from '../src/auth/dto/signin-body.dto';
import { SigninResponseDto } from '../src/auth/dto/signin-response.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../src/auth/entities/token-payload.entity';
import { UserModel } from '../src/users/models';
import { UserSessionRepository } from '../src/auth/user-session.repository';
import { UsersRepository } from '../src/users/users.repository';

describe('AuthController (e2e)', () => {
  let context: TestHelper;
  let encryptService: EncryptService;

  let authSaveSpy: jest.SpyInstance;
  let userFindByEmailSpy: jest.SpyInstance;
  let authDeleteSpy: jest.SpyInstance;

  let jwtService: JwtService;

  beforeAll(async () => {
    context = await TestHelper.initTestApp();
    encryptService = context.app.get(EncryptService);
    authSaveSpy = jest.spyOn(context.app.get(UserSessionRepository), 'create');
    authDeleteSpy = jest.spyOn(
      context.app.get(UserSessionRepository),
      'deleteByToken',
    );
    userFindByEmailSpy = jest.spyOn(
      context.app.get(UsersRepository),
      'findByEmail',
    );
    jwtService = new JwtService({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION ?? '3600',
      },
    });
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

  const loadDummyUsers = async (): Promise<User[]> => {
    const usersData: CreateUserDto[] = [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: encryptService.hash('password1'),
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: encryptService.hash('password2'),
      },
    ];

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

  describe('POST /signin', () => {
    it('should login an existing user', async () => {
      await loadDummyUsers();
      const user: SigninBodyDto = {
        email: 'user1@example.com',
        password: 'password1',
      };

      const response = await request(context.app.getHttpServer())
        .post('/auth/signin')
        .send(user)
        .expect(201);

      const responseBody = response.body as SigninResponseDto;
      expect(responseBody).toHaveProperty('accessToken');
      expect(responseBody.user.email).toBe(user.email);
      expect(responseBody.user).not.toHaveProperty('password');
    });

    it('should throw Not Found if user does not exists', async () => {
      await loadDummyUsers();
      const user: SigninBodyDto = {
        email: 'notExistingUser@example.com',
        password: 'password1',
      };

      await request(context.app.getHttpServer())
        .post('/auth/signin')
        .send(user)
        .expect(404);

      expect(authSaveSpy).not.toHaveBeenCalled();
    });

    it('should throw Unauthorized if user password does not match', async () => {
      await loadDummyUsers();
      const user: SigninBodyDto = {
        email: 'user1@example.com',
        password: 'fakepass',
      };

      await request(context.app.getHttpServer())
        .post('/auth/signin')
        .send(user)
        .expect(401);

      expect(userFindByEmailSpy).toHaveBeenCalled();
      expect(authSaveSpy).not.toHaveBeenCalled();
    });
  });

  describe('POST /signout', () => {
    it('should sign out an signed user', async () => {
      await loadDummyUsers();
      const user: SigninBodyDto = {
        email: 'user1@example.com',
        password: 'password1',
      };

      const signinResponse = await request(context.app.getHttpServer())
        .post('/auth/signin')
        .send(user)
        .expect(201);

      const { accessToken } = signinResponse.body as SigninResponseDto;

      await request(context.app.getHttpServer())
        .post('/auth/signout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const { tokenId }: TokenPayload = jwtService.decode(accessToken);
      expect(authDeleteSpy).toHaveBeenCalledWith(tokenId);
    });

    it('should throw Unauthorized if there is no access token', async () => {
      await request(context.app.getHttpServer())
        .post('/auth/signout')
        .expect(401);

      expect(authDeleteSpy).not.toHaveBeenCalled();
    });
  });
});

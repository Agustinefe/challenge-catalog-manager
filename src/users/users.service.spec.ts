import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './entities';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { EncryptService } from '../../src/common/encrypt.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockRepository = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        EncryptService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {
      id: 1,
      username: 'John Doe',
      email: 'user@example.com',
      password: 'pass1234',
    };
    const createUserDto: CreateUserDto = {
      username: user.username,
      email: user.email,
      password: user.password,
    };
    const result: UserDto = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    jest.spyOn(repository, 'create').mockResolvedValue(Promise.resolve(user));
    expect(await service.create(createUserDto)).toEqual(result);
  });

  it('should find all users', async () => {
    const users: User[] = [
      {
        id: 1,
        username: 'John Doe',
        email: 'user@example.com',
        password: 'pass1234',
      },
      {
        id: 2,
        username: 'Jane Doe',
        email: 'user2@example.com',
        password: 'pass2345',
      },
    ];
    const userDtos: User[] = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    })) as User[];

    jest
      .spyOn(repository, 'findAll')
      .mockResolvedValue(Promise.resolve(userDtos));
    expect(await service.findAll()).toEqual(userDtos);
  });

  it('should find one user by id', async () => {
    const user: User = {
      id: 1,
      username: 'John Doe',
      email: 'user@example.com',
      password: 'pass1234',
    };
    const userDto: User = {
      id: user.id,
      username: user.username,
      email: user.email,
    } as User;

    jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(Promise.resolve(userDto));
    expect(await service.findOne(1)).toEqual(userDto);
  });

  it('should throw if no user was found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(Promise.resolve(null));
    await expect(async () => await service.findOne(1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'newEmail@example.com',
    };
    const updatedUser: User = {
      id: 1,
      username: 'John Doe',
      email: 'newEmail@example.com',
      password: 'pass1234',
    };
    const result: UserDto = {
      id: 1,
      username: 'John Doe',
      email: 'newEmail@example.com',
    };

    jest
      .spyOn(repository, 'update')
      .mockResolvedValue(Promise.resolve(updatedUser));
    expect(await service.update(1, updateUserDto)).toEqual(result);
  });

  it('should throw if no user was found while updating', async () => {
    jest.spyOn(repository, 'update').mockResolvedValue(Promise.resolve(null));
    await expect(
      async () =>
        await service.update(1, {
          email: 'newEmail@example.com',
        }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a user', async () => {
    const user: User = {
      id: 1,
      username: 'John Doe',
      email: 'newEmail@example.com',
      password: 'pass1234',
    };
    jest.spyOn(repository, 'findOne').mockResolvedValue(Promise.resolve(user));
    jest.spyOn(repository, 'remove').mockResolvedValue(Promise.resolve());
    expect(await service.remove(1)).toBeUndefined();
  });

  it('should throw if no user was found while removing', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(Promise.resolve(null));
    jest.spyOn(repository, 'remove').mockResolvedValue(Promise.resolve());
    await expect(async () => await service.remove(1)).rejects.toThrow(
      NotFoundException,
    );
  });
});

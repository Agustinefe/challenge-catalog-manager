import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { UsersRepository } from './users.repository';
import { EncryptService } from '../common/encrypt.service';
import { UserBaseDto } from './dto/user-base.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRespository: UsersRepository,
    private encrypService: EncryptService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    createUserDto.password = this.encrypService.hash(createUserDto.password);
    const newUser = await this.userRespository.create(createUserDto);
    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
  }

  async findAll(): Promise<UserDto[]> {
    return this.userRespository.findAll(['id', 'username', 'email']);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRespository.findOne(id, [
      'id',
      'username',
      'email',
    ]);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findOneByEmail(email: string): Promise<UserBaseDto> {
    const user = await this.userRespository.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    if (updateUserDto.password)
      updateUserDto.password = this.encrypService.hash(updateUserDto.password);

    const user = await this.userRespository.update(id, updateUserDto);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRespository.findOne(id, [
      'id',
      'username',
      'email',
    ]);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    await this.userRespository.remove(user);
  }
}

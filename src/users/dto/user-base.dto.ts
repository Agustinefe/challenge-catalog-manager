import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsUUID,
} from 'class-validator';

export class UserBaseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  @IsString()
  @IsUUID()
  id: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'jonhdoe@email.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strongPassword123',
  })
  @IsString()
  @MinLength(8)
  password: string;

  constructor(base: User) {
    this.id = base.id;
    this.username = base.username;
    this.email = base.email;
    this.password = base.password;
  }
}

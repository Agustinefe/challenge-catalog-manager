import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { CommonModule } from '../common/common.module';
import { DatabaseModule } from '../../src/database/database.module';

@Module({
  imports: [DatabaseModule, CommonModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule { }

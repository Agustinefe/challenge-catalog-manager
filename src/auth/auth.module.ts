import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSessionRepository } from './user-session.repository';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './guards/access-token.guard';
import { DatabaseModule } from '../../src/database/database.module';

@Module({
  imports: [UsersModule, CommonModule, JwtModule.register({}), DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserSessionRepository,
    AccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AuthModule { }

import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninBodyDto } from './dto/signin-body.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TokenPayload } from './entities/token-payload.entity';
import type { Request } from 'express';
import { Public } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Sign in an user' })
  @ApiBody({ type: SigninBodyDto })
  @ApiOkResponse({
    description: 'The user has been successfully signed in',
    type: SigninResponseDto,
    isArray: false,
  })
  @Public()
  @Post('signin')
  async signIn(@Body() signInBody: SigninBodyDto): Promise<SigninResponseDto> {
    return await this.authService.signIn(signInBody);
  }

  @ApiOperation({ summary: 'Sign out an user' })
  @ApiOkResponse({
    description: 'The user has been successfully signed out',
  })
  @Post('signout')
  @ApiBearerAuth()
  async signOut(@Req() req: Request): Promise<void> {
    const payload = req.user as TokenPayload;
    await this.authService.signOut(payload.tokenId);
  }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninBodyDto } from './dto/signin-body.dto';
import { UserSessionRepository } from './user-session.repository';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { EncryptService } from '../common/encrypt.service';
import { v4 as uuidv4 } from 'uuid';
import { TokenPayload } from './entities/token-payload.entity';
import { JwtService } from '@nestjs/jwt';
import { EnvNames } from '../config/joi.validation';
import { SigninResponseDto } from './dto/signin-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userSessionRepository: UserSessionRepository,
    private usersService: UsersService,
    private configService: ConfigService,
    private encryptService: EncryptService,
    private jwtService: JwtService,
  ) { }

  private generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(EnvNames.JWT_ACCESS_TOKEN_SECRET),
      expiresIn: this.configService.get<number>(
        EnvNames.JWT_ACCESS_TOKEN_DURATION,
      ),
    });
  }

  private calculateExpiryDate(): Date {
    return new Date(
      Date.now() +
      1000 *
      this.configService.get<number>(EnvNames.JWT_ACCESS_TOKEN_DURATION)!,
    );
  }

  async signIn(signInBody: SigninBodyDto): Promise<SigninResponseDto> {
    const user = await this.usersService.findOneByEmail(signInBody.email);
    if (!user)
      throw new NotFoundException(
        `User with email ${signInBody.email} not found`,
      );

    const passwordMatches = this.encryptService.compare(
      signInBody.password,
      user.password,
    );
    if (!passwordMatches) throw new UnauthorizedException('Unauthorized user');

    const tokenId = uuidv4();

    const accessToken = this.generateAccessToken({
      tokenId,
      id: user.id,
      email: user.email,
    });

    await this.userSessionRepository.create({
      tokenId,
      userId: user.id,
      expiryDate: this.calculateExpiryDate(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return {
      accessToken,
      user: rest,
    };
  }

  async signOut(tokenId: string): Promise<void> {
    await this.userSessionRepository.deleteByToken(tokenId);
  }
}

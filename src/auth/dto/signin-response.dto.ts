import { UserDto } from '../../users/dto';

export class SigninResponseDto {
  user: UserDto;
  accessToken: string;
}

import { OmitType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class UserDto extends OmitType(UserBaseDto, ['password'] as const) { }

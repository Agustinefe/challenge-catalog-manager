import { OmitType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class CreateUserDto extends OmitType(UserBaseDto, ['id'] as const) { }

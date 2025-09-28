import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

const ENCRYPTER_SALT = 10;

@Injectable()
export class EncryptService {
  hash(password: string): string {
    return bcrypt.hashSync(password, ENCRYPTER_SALT);
  }

  compare(left: string, right: string): boolean {
    return bcrypt.compareSync(left, right);
  }
}

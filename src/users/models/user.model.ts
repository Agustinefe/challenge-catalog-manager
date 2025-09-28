import { RowDataPacket } from 'mysql2';

export interface UserModel extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
}

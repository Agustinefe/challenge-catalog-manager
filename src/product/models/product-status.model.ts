import { RowDataPacket } from 'mysql2';

export interface ProductStatusModel extends RowDataPacket {
  id: number;
  description: string;
}

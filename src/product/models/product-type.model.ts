import { RowDataPacket } from 'mysql2';

export interface ProductTypeModel extends RowDataPacket {
  id: number;
  code: string;
  description: string;
}

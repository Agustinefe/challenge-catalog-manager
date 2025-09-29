import { RowDataPacket } from 'mysql2';

export interface ProductCategoryModel extends RowDataPacket {
  id: number;
  code: string;
  description: string;
}

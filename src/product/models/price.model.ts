import { RowDataPacket } from 'mysql2';

export interface PriceModel extends RowDataPacket {
  id: number;
  price: number;
  fromDate: Date;
  toDate: Date;
  productId: number; // FK
}

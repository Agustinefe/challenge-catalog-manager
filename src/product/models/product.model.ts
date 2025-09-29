import { RowDataPacket } from 'mysql2';

export interface ProductModel extends RowDataPacket {
  id: number;
  sku: string;
  shortDescription: string;
  longDescription: string;
  qty: number | null;
  imageUrl: string | null;
  productTypeId: number; // FK
  productCategoryId: number; // FK
  productStateId: number; // FK
}

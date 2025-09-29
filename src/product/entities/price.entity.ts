export class ProductPrice {
  id: number;
  price: number;
  fromDate: Date;
  toDate: Date;
  productId: number; // FK
}

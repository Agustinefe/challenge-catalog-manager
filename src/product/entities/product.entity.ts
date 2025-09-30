export class Product {
  id: number;
  sku: string;
  shortDescription: string;
  longDescription: string;
  slug: string;
  qty: number | null;
  imageUrl: string | null;
  productTypeId: number;
  productCategoryId: number;
  productStateId: number;
}

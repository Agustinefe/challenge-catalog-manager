export class ProductDto {
  id: number;
  sku: string;
  shortDescription: string;
  longDescription: string;
  qty: number | null;
  imageUrl: string | null;
  productTypeId: number;
  productCategoryId: number;
  productStateId: number;
}

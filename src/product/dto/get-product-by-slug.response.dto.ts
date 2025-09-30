import { ProductDto } from './product.dto';

export class GetProductBySlugResponseDto {
  product: ProductDto | null;
  relatedProducts: ProductDto[];
}

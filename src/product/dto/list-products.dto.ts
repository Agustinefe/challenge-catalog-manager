import { ProductCategoryDto } from './product-category.dto';
import { ProductPriceDto } from './product-price.dto';
import { ProductDto } from './product.dto';

export class ListProductsDto extends ProductDto {
  currentPrice: Pick<ProductPriceDto, 'id' | 'price'>;
  category: ProductCategoryDto;
}

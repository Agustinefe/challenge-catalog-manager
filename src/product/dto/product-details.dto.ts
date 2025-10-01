import { ProductCategoryDto } from './product-category.dto';
import { ProductPriceDto } from './product-price.dto';
import { ProductStateDto } from './product-state.dto';
import { ProductDto } from './product.dto';

export class ProductDetailsDto extends ProductDto {
  currentPrice: Pick<ProductPriceDto, 'id' | 'price'>;
  category: ProductCategoryDto;
  state: ProductStateDto;
}

import { Injectable } from '@nestjs/common';
import { ProductService } from '../../src/product/product.service';
import { SearchProductQueryDto } from './dto/search-products-query.dto';
import { ListProductsResponseDto } from 'src/product/dto/list-products.response.dto';

@Injectable()
export class SearchService {
  constructor(private readonly productService: ProductService) { }

  async searchProducts(
    queryDto: SearchProductQueryDto,
  ): Promise<ListProductsResponseDto> {
    const { sku, description, ...pagination } = queryDto;
    return await this.productService.getProductsBySkuAndDescription(
      pagination,
      sku,
      description,
    );
  }
}

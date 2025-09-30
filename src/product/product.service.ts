import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ListProductPaginationDto } from './dto/list-products-pagination.dto';
import { ListProductsResponseDto } from './dto/list-products.response.dto';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) { }

  async listProducts(
    paginationDto: ListProductPaginationDto,
  ): Promise<ListProductsResponseDto> {
    const { total, rows } =
      await this.productRepository.listProductsPaginated(paginationDto);
    return {
      data: rows,
      meta: {
        totalItems: total,
        count: rows.length,
        pageSize: paginationDto.pageSize,
        page: paginationDto.page,
      },
    };
  }
}

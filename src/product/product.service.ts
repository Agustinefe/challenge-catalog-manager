import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { ProductRepository } from './product.repository';
import { ListProductsDto } from './dto/list-products.dto';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) { }

  async listProducts(paginationDto: PaginationDto): Promise<ListProductsDto[]> {
    return await this.productRepository.findManyPaginated(paginationDto);
  }
}

import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { RowDataPacket } from 'mysql2';
import { ListProductsDto } from './dto/list-products.dto';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) { }

  async listProducts(paginationDto: PaginationDto): Promise<ListProductsDto[]> {
    console.log(paginationDto);
    return await this.productRepository.findManyPaginated();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ListProductPaginationDto } from './dto/list-products-pagination.dto';
import { ListProductsResponseDto } from './dto/list-products.response.dto';
import { Product } from './entities/product.entity';
import { GetProductBySlugResponseDto } from './dto/get-product-by-slug.response.dto';

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

  async getProductBySlug(slug: string): Promise<GetProductBySlugResponseDto> {
    const product = await this.productRepository.findProductBySlug(slug);
    if (product)
      return {
        product,
        relatedProducts: await this.getRelatedProductsTo(product),
      };

    return {
      product: null,
      relatedProducts: await this.getAlternativeProductsTo(slug),
    };
  }

  async getRelatedProductsTo(product: Product): Promise<Product[]> {
    return await this.productRepository.findNProductsNearToSlug(
      product.slug,
      2,
    );
  }

  async getAlternativeProductsTo(slug: string): Promise<Product[]> {
    return await this.productRepository.findNProductsNearToSlug(slug, 2);
  }
}

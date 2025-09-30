import { Injectable } from '@nestjs/common';
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

  async getProductBySlug(
    slug: string,
    limit: number,
  ): Promise<GetProductBySlugResponseDto> {
    const product = await this.productRepository.findProductBySlug(slug);
    if (product)
      return {
        product,
        relatedProducts: await this.getProductsRelatedTo(product, limit),
      };

    return {
      product: null,
      relatedProducts: await this.getAlternativeProductsFor(slug, limit),
    };
  }

  async getProductsRelatedTo(
    product: Product,
    limit: number,
  ): Promise<Product[]> {
    return await this.productRepository.findNProductsNearToSlug(
      product.slug,
      limit,
    );
  }

  async getAlternativeProductsFor(
    slug: string,
    limit: number,
  ): Promise<Product[]> {
    return await this.productRepository.findNProductsNearToSlug(slug, limit);
  }

  async getProductsBySkuAndDescription(
    paginationDto: ListProductPaginationDto,
    sku?: string,
    description?: string,
  ): Promise<ListProductsResponseDto> {
    const { total, rows } =
      await this.productRepository.getProductsBySkuAndDescription(
        paginationDto,
        sku,
        description,
      );
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

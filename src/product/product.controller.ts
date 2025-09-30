import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ListProductsDto } from './dto/list-products.dto';
import { ListProductPaginationDto } from './dto/list-products-pagination.dto';
import { ListProductsResponseDto } from './dto/list-products.response.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @ApiOperation({ summary: 'List the products' })
  @ApiOkResponse({
    description: 'Returns a product page',
    type: ListProductsDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @Get()
  async listProducts(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    paginationDto: ListProductPaginationDto,
  ): Promise<ListProductsResponseDto> {
    return await this.productService.listProducts(paginationDto);
  }
}

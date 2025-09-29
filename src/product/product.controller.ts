import { Controller, Get, Body, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { ListProductsDto } from './dto/list-products.dto';

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
    paginationDto: PaginationDto,
  ): Promise<ListProductsDto[]> {
    return await this.productService.listProducts(paginationDto);
  }
}

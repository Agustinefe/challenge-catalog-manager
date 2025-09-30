import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchProductQueryDto } from './dto/search-products-query.dto';
import { ListProductsResponseDto } from 'src/product/dto/list-products.response.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @ApiOperation({
    summary: 'Search products by SKU and/or description',
  })
  @ApiOkResponse({
    description: 'Returns a list of products',
    type: ListProductsResponseDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @Get()
  async searchProducts(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    queryDto: SearchProductQueryDto,
  ): Promise<ListProductsResponseDto> {
    return await this.searchService.searchProducts(queryDto);
  }
}

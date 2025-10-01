import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ListProductPaginationDto } from '../../../src/product/dto/list-products-pagination.dto';

export class SearchProductQueryDto extends ListProductPaginationDto {
  @ApiProperty({
    description: 'Stock Keeping Unit',
    example: 'HOL11020300401',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  sku?: string;

  @ApiProperty({
    description: 'The product description',
    example: 'LUGARES',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;
}

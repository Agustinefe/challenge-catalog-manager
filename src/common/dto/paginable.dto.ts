import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { SortOrder } from './sort-order.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductSortColumn } from '../../product/entities/product-sort-column.entity';

export class PaginableDto {
  @ApiProperty({
    description: 'The current page number',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'The current page size',
    example: 5,
  })
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(1)
  pageSize: number;
}

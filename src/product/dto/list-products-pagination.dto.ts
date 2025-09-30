import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '../../common/dto/sort-order.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductSortColumn } from '../../product/entities/product-sort-column.entity';
import { PaginableDto } from '../../../src/common/dto/paginable.dto';

export class ListProductPaginationDto extends PaginableDto {
  @ApiProperty({
    description: 'The field which the list will be sorted by.',
    example: ProductSortColumn.CATEGORY,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductSortColumn)
  sortBy?: ProductSortColumn;

  @ApiProperty({
    description: 'The field which the list will be sorted by.',
    example: SortOrder.ASC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;
}

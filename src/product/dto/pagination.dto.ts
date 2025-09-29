import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { SortOrder } from '../entities/sort-order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'The current page number',
    example: 1,
  })
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'The current page size',
    example: 5,
  })
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @Min(1)
  pageSize: number;

  @ApiProperty({
    description: 'The field which the list will be sorted by.',
    example: 'category',
  })
  @IsOptional()
  @IsString()
  sortBy: string = 'id';

  @ApiProperty({
    description:
      'The field which the list will be sorted by. The default is ASC.',
    example: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;
}

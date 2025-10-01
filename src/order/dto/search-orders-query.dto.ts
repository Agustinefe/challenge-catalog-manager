import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchOrdersQueryDto {
  @ApiProperty({
    description: 'The order identifier',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    description: "The cuit of the order's client",
    example: '20205558692',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  cuit?: string;

  @ApiProperty({
    description: 'The minimum date when the order was created',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAtMin?: Date;

  @ApiProperty({
    description: 'The maximum date when the order was created',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAtMax?: Date;
}

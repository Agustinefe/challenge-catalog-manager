import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}

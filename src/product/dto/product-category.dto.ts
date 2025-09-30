import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryDto {
  @ApiProperty({
    description: 'The product category identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The category code',
    example: 'HOL',
  })
  code: string;

  @ApiProperty({
    description: 'The category description',
    example: 'Familia Hola',
  })
  description: string;
}

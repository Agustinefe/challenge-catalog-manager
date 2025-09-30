import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'The product identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description:
      'Stock Keeping Unit, an unique identifier used to keep track of the inventory',
    example: 'LUG00006500259',
  })
  sku: string;

  @ApiProperty({
    description: 'The short description of the product',
    example: 'HOLA',
  })
  shortDescription: string;

  @ApiProperty({
    description: 'The long description of the product',
    example: '¡HOLA! Argentina Ed.401',
  })
  longDescription: string;

  @ApiProperty({
    description: 'The product quantity',
    example: 6,
    nullable: true,
  })
  qty: number | null;

  @ApiProperty({
    description: 'Easy-to-read identifier of the product',
    example: 'hola-argentina-ed-401',
  })
  slug: string;

  @ApiProperty({
    description: 'Product image url',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Product type identifier',
  })
  productTypeId: number;

  @ApiProperty({
    description: 'Product category identifier',
  })
  productCategoryId: number;

  @ApiProperty({
    description: 'Product state identifier',
  })
  productStateId: number;
}

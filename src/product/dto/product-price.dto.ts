import { ApiProperty } from '@nestjs/swagger';

export class ProductPriceDto {
  @ApiProperty({
    description: 'The product price identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The price value',
    example: 100,
  })
  price: number;

  @ApiProperty({
    description: 'The date when the price starts to be valid',
  })
  fromDate: Date;

  @ApiProperty({
    description: 'The date when the price ends to be valid',
  })
  toDate: Date;

  @ApiProperty({
    description: 'The product identifier',
    example: 1,
  })
  productId: number; // FK
}

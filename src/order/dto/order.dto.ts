import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class OrderDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'Date when the order was issued',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  issueDate: Date;

  @ApiProperty({
    description: 'Total price of the order',
    example: 125.5,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Delivery class for the order',
    example: 'EXPRESS',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  deliveryClass: string;

  @ApiProperty({
    description: 'Applied payment condition',
    example: 'CASH',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  appliedPaymentCondition: string;

  @ApiProperty({
    description: 'ID of the client who placed the order',
    example: 123,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  clientId: number;

  @ApiProperty({
    description: 'ID of the product being ordered',
    example: 456,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Amount of products requested',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  requestedAmount: number;
}

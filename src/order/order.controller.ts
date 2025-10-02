import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SearchOrdersQueryDto } from './dto/search-orders-query.dto';
import { CreateOrderDto, OrderDto } from './dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @ApiOperation({
    summary: 'Search for orders',
    description: 'Search for orders by id, cuit, and/or creation date',
  })
  @ApiOkResponse({
    description: 'Returns the matched order(s)',
    type: OrderDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @Get()
  async findOrders(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    queryDto: SearchOrdersQueryDto,
  ): Promise<OrderDto[]> {
    return await this.orderService.findOrders(queryDto);
  }

  @ApiOperation({
    summary: 'Create a new order',
    description:
      'To create an order, the product and the client must exists, and the product must have enough stock to satisfy the order.',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({
    description: 'Returns the new order',
    type: OrderDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description:
      'The product is no enabled to be ordered, or does not have stock enough to satisfy the order.',
  })
  @ApiNotFoundResponse({
    description: 'The product or the client does not exists.',
  })
  @ApiBearerAuth()
  @Post()
  async getProductBySlug(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    return await this.orderService.createOrder(createOrderDto);
  }
}

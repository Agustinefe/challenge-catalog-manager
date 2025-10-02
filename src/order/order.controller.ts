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
  ApiBearerAuth,
  ApiBody,
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
    description: 'Search for orders by id and/or cuit',
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
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiOkResponse({
    description: 'Returns the new order',
    type: OrderDto,
    isArray: false,
  })
  @ApiBearerAuth()
  @Post()
  async getProductBySlug(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    return await this.orderService.createOrder(createOrderDto);
  }
}

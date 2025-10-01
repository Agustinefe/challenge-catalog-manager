import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SearchOrdersQueryDto } from './dto/search-orders-query.dto';
import { ValidateDateRangePipe } from 'src/common/pipes/validate-date-range.pipe';
import { OrderDto } from './dto';

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
  @Get('')
  async getProductBySlug(
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
}

import { Injectable } from '@nestjs/common';
import { SearchOrdersQueryDto } from './dto/search-orders-query.dto';
import { OrderRepository } from './order.repository';
import { OrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) { }

  async findOrders(query: SearchOrdersQueryDto): Promise<OrderDto[]> {
    return await this.orderRepository.findOrdersByIdAndCuit(
      query.id,
      query.cuit,
    );
  }
}

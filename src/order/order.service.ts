import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SearchOrdersQueryDto } from './dto/search-orders-query.dto';
import { OrderRepository } from './order.repository';
import { CreateOrderDto, OrderDto } from './dto';
import { ProductService } from '../../src/product/product.service';
import { ProductDto } from '../../src/product/dto/product.dto';
import { ClientService } from '../../src/client/client.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductService,
    private readonly clientService: ClientService,
  ) { }

  private validateThatProductCanBeOrdered(
    product: ProductDto,
    requestedAmount: number,
  ) {
    if (!(product.qty && product.qty > 0)) {
      throw new BadRequestException(
        `Product with id ${product.id} is out of stock`,
      );
    }

    if (!(product.qty > requestedAmount)) {
      throw new BadRequestException(
        `Product with id ${product.id} does not have enough stock to satisfy the order`,
      );
    }

    if (product.productStateId === 1) {
      // If it is inhabilited
      throw new BadRequestException(
        `Product with id ${product.id} can not be ordered`,
      );
    }
  }

  async findOrders(query: SearchOrdersQueryDto): Promise<OrderDto[]> {
    return await this.orderRepository.findOrdersByIdAndCuit(
      query.id,
      query.cuit,
      { createdAtMin: query.createdAtMin, createdAtMax: query.createdAtMax },
    );
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const { productId, clientId } = createOrderDto;
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    this.validateThatProductCanBeOrdered(
      product,
      createOrderDto.requestedAmount,
    );

    const client = await this.clientService.findById(clientId);
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const newOrder = await this.orderRepository.createOrder({
      ...createOrderDto,
      price: product.currentPrice.price,
    });

    const newProductQuantity = product.qty! - newOrder.requestedAmount;

    try {
      await this.productService.update(productId, { qty: newProductQuantity });
    } catch (e) {
      await this.orderRepository.remove(newOrder);
      throw e;
    }

    return newOrder;
  }
}

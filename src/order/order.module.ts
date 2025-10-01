import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OrderRepository } from './order.repository';
import { ProductModule } from 'src/product/product.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [DatabaseModule, ProductModule, ClientModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule { }

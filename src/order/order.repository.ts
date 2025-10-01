import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../src/database/database.provider';
import { HandleDBExceptions } from 'src/database/decorators';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrderRepository {
  constructor(private db: DatabaseProvider) { }

  @HandleDBExceptions()
  async findOrdersByIdAndCuit(
    id?: number,
    cuit?: string,
    createdAt?: { createdAtMin?: Date; createdAtMax?: Date },
  ): Promise<Order[]> {
    const filters = [];

    if (id) {
      filters.push(`o.id = ${id}`);
    }

    if (cuit) {
      filters.push(`c.cuit = '${cuit}'`);
    }

    if (createdAt) {
      if (createdAt.createdAtMin) {
        filters.push(
          `o.issueDate >= '${this.db.dateToSqlTimestamp(createdAt.createdAtMin)}'`,
        );
      }
      if (createdAt.createdAtMax) {
        filters.push(
          `o.issueDate <= '${this.db.dateToSqlTimestamp(createdAt.createdAtMax)}'`,
        );
      }
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
      SELECT o.* FROM orders as o
      INNER JOIN clients as c on o.clientId = c.id
      ${where};
    `;

    const [rows] =
      await this.db.connection.query<(Order & RowDataPacket)[]>(query);
    return rows;
  }

  async createOrder(
    createOrderDto: CreateOrderDto & { price: number },
  ): Promise<Order> {
    const orders = [
      createOrderDto.price,
      createOrderDto.deliveryClass,
      createOrderDto.appliedPaymentCondition,
      createOrderDto.clientId,
      createOrderDto.productId,
      createOrderDto.requestedAmount,
    ];

    const columns = [
      'price',
      'deliveryClass',
      'appliedPaymentCondition',
      'clientId',
      'productId',
      'requestedAmount',
    ];

    const [result] = await this.db.connection.execute<ResultSetHeader>(
      `INSERT INTO orders (${columns.join(', ')}) VALUES ?`,
      [orders],
    );

    const [rows] = await this.db.connection.execute<(Order & RowDataPacket)[]>(
      'SELECT * FROM orders` WHERE `id` = ? LIMIT 1',
      [result.insertId],
    );

    return rows[0];
  }

  @HandleDBExceptions()
  async remove({ id }: Order): Promise<void> {
    const query = 'DELETE FROM orders WHERE `id` = ? LIMIT 1';
    await this.db.connection.execute(query, [id]);
  }
}

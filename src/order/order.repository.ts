import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../src/database/database.provider';
import { HandleDBExceptions } from 'src/database/decorators';
import { RowDataPacket } from 'mysql2';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderRepository {
  constructor(private db: DatabaseProvider) { }

  @HandleDBExceptions()
  async findOrdersByIdAndCuit(id?: number, cuit?: string): Promise<Order[]> {
    const filters = [];

    if (id) {
      filters.push(`o.id = ${id}`);
    }

    if (cuit) {
      filters.push(`c.cuit = '${cuit}'`);
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
}

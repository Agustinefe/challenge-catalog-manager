import * as mysql from 'mysql2/promise';
import data from '../../../init-data/pedidos.json';
import BaseSeeder from './base.seed';
import { Order } from '../../../src/order/entities/order.entity';

export default class OrderSeeder extends BaseSeeder<Order> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id integer PRIMARY KEY,
        issueDate timestamp DEFAULT CURRENT_TIMESTAMP,
        price decimal,
        deliveryClass varchar(255),
        appliedPaymentCondition varchar(255),
        clientId integer NOT NULL,
        productId integer NOT NULL,
        requestedAmount integer
      );
    `;
    await this.conn.execute(createTableQuery);
    await this.conn.execute(
      'ALTER TABLE orders ADD FOREIGN KEY (`productId`) REFERENCES `products` (`id`);',
    );
    await this.conn.execute(
      'ALTER TABLE orders ADD FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`);',
    );
  }

  public async dropTable(): Promise<void> {
    const dropTableQuery = `
      DROP TABLE IF EXISTS orders;
    `;
    await this.conn.execute(dropTableQuery);
  }

  public async populate(): Promise<Order[]> {
    const products = data.map((o) => [
      o.id,
      o.fecha_circulacion,
      o.precio,
      o.clase_entrega,
      o.condicion_pago_aplicada,
      o.cliente_id,
      o.producto_id,
      o.cantidad_solicitada,
    ]);

    const columns = [
      'id',
      'issueDate',
      'price',
      'deliveryClass',
      'appliedPaymentCondition',
      'clientId',
      'productId',
      'requestedAmount',
    ];

    await this.conn.query(
      `INSERT INTO orders (${columns.join(', ')}) VALUES ?`,
      [products],
    );

    const [rows] = await this.conn.execute<(Order & mysql.RowDataPacket)[]>(
      'SELECT * FROM orders',
    );
    return rows;
  }
}

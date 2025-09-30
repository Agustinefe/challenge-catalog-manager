import * as mysql from 'mysql2/promise';
import data from '../../../init-data/lista_precio.json';
import BaseSeeder from './base.seed';
import { ProductPrice } from '../../../src/product/entities/price.entity';

export default class PriceListSeeder extends BaseSeeder<ProductPrice> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS price_list (
        id integer PRIMARY KEY,
        price decimal,
        fromDate timestamp,
        toDate timestamp,
        productId integer NOT NULL
      );
    `;
    await this.conn.execute(createTableQuery);

    await this.conn.execute(
      'ALTER TABLE price_list ADD FOREIGN KEY (`productId`) REFERENCES `products` (`id`);',
    );
  }

  public async dropTable(): Promise<void> {
    const dropTableQuery = `
      DROP TABLE IF EXISTS price_list;
    `;
    await this.conn.execute(dropTableQuery);
  }

  public async populate(): Promise<ProductPrice[]> {
    const priceList = data.map((u) => [
      u.id,
      u.precio,
      u.fecha_desde,
      u.fecha_hasta,
      u.producto_id,
    ]);

    await this.conn.query(
      'INSERT INTO price_list (id, price, fromDate, toDate, productId) VALUES ?',
      [priceList],
    );

    const [rows] = await this.conn.execute<
      (ProductPrice & mysql.RowDataPacket)[]
    >('SELECT * FROM price_list');
    return rows;
  }
}

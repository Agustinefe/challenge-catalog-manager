import * as mysql from 'mysql2/promise';
import data from '../../../init-data/producto_estado.json';
import BaseSeeder from './base.seed';
import { ProductStatus } from '../../../src/product/entities/product-status.entity';

export default class ProductStatusSeeder extends BaseSeeder<ProductStatus> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS product_status (
        id integer AUTO_INCREMENT PRIMARY KEY,
        description varchar(255)
      );
    `;
    await this.conn.execute(createTableQuery);
  }

  public async dropTable(): Promise<void> {
    const dropTableQuery = `
      DROP TABLE IF EXISTS product_status;
    `;
    await this.conn.execute(dropTableQuery);
  }

  public async populate(): Promise<ProductStatus[]> {
    const productStatus = data.map((u) => [u.id, u.descripcion]);

    await this.conn.query(
      'INSERT INTO product_status (id, description) VALUES ?',
      [productStatus],
    );

    const [rows] = await this.conn.execute<
      (ProductStatus & mysql.RowDataPacket)[]
    >('SELECT * FROM product_status');
    return rows;
  }
}

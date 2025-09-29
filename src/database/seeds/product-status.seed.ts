import * as mysql from 'mysql2/promise';
import data from '../../../init-data/producto_estado.json';
import BaseSeeder from './base.seed';
import { ProductStatusModel } from 'src/product/models/product-status.model';

export default class ProductStatusSeeder extends BaseSeeder<ProductStatusModel> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE product_status (
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

  public async populate(): Promise<ProductStatusModel[]> {
    const productStatus = data.map((u) => [u.id, u.descripcion]);

    await this.conn.query(
      'INSERT INTO product_status (id, description) VALUES ?',
      [productStatus],
    );

    const [rows] = await this.conn.execute<ProductStatusModel[]>(
      'SELECT * FROM product_status',
    );
    return rows;
  }
}

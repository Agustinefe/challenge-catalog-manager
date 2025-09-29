import * as mysql from 'mysql2/promise';
import data from '../../../init-data/producto_tipo.json';
import BaseSeeder from './base.seed';
import { ProductCategoryModel } from 'src/product/models/product-category.model';

export default class ProductCategorySeeder extends BaseSeeder<ProductCategoryModel> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE product_type (
        id integer AUTO_INCREMENT PRIMARY KEY,
        code varchar(255),
        description varchar(255)
      );
    `;
    await this.conn.execute(createTableQuery);
  }

  public async dropTable(): Promise<void> {
    const dropTableQuery = `
      DROP TABLE IF EXISTS product_type;
    `;
    await this.conn.execute(dropTableQuery);
  }

  public async populate(): Promise<ProductCategoryModel[]> {
    const productTypes = data.map((u) => [u.codigo, u.descripcion]);

    await this.conn.query(
      'INSERT INTO product_type (code, description) VALUES ?',
      [productTypes],
    );

    const [rows] = await this.conn.execute<ProductCategoryModel[]>(
      'SELECT * FROM users',
    );
    return rows;
  }
}

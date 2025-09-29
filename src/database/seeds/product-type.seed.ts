import { EncryptService } from '../../common/encrypt.service';
import * as mysql from 'mysql2/promise';
import data from '../../../init-data/producto_tipo.json';
import BaseSeeder from './base.seed';
import { UserModel } from '../../../src/users/models';

export default class ProductTypeSeeder extends BaseSeeder<UserModel> {
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

  public async populate(): Promise<UserModel[]> {
    const productTypes = data.map((u) => [u.codigo, u.descripcion]);

    await this.conn.query(
      'INSERT INTO product_type (code, description) VALUES ?',
      [productTypes],
    );

    const [rows] = await this.conn.execute<UserModel[]>('SELECT * FROM users');
    return rows;
  }
}

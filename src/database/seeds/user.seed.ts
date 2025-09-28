import { EncryptService } from '../../common/encrypt.service';
import * as mysql from 'mysql2/promise';
import data from '../../../init-data/usuarios.json';
import BaseSeeder from './base.seed';
import { UserModel } from '../../../src/users/models';

export default class UserSeeder extends BaseSeeder<UserModel> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `;
    await this.conn.execute(createTableQuery);
  }

  public async dropTable(): Promise<void> {
    const dropTableQuery = `
      DROP TABLE IF EXISTS users;
    `;
    await this.conn.execute(dropTableQuery);
  }

  public async populate(): Promise<UserModel[]> {
    const encrypter = new EncryptService();

    const users = data.map((u) => [
      u.username,
      u.email,
      encrypter.hash(u.password),
    ]);

    await this.conn.query(
      'INSERT INTO users (username, email, password) VALUES ?',
      [users],
    );

    const [rows] = await this.conn.execute<UserModel[]>('SELECT * FROM users');
    return rows;
  }
}

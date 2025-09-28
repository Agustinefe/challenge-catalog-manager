import * as mysql from 'mysql2/promise';
import BaseSeeder from './base.seed';
import { UserSessionModel } from '../../../src/auth/models/user-session.model';

export default class UserSessionSeeder extends BaseSeeder<UserSessionModel> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_sessions (
          tokenId VARCHAR(36) PRIMARY KEY,
          userId INT NOT NULL,
          expiryDate TIMESTAMP NOT NULL,
          CONSTRAINT fk_user
              FOREIGN KEY(userId) 
              REFERENCES users(id)
              ON DELETE CASCADE
      );
    `;
    await this.conn.execute(createTableQuery);
  }

  public async dropTable(): Promise<void> {
    const dropTableQuery = `
      DROP TABLE IF EXISTS user_sessions;
    `;
    await this.conn.execute(dropTableQuery);
  }

  public async populate(): Promise<UserSessionModel[]> {
    return Promise.resolve([]);
  }
}

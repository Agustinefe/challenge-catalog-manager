import * as mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';

export default abstract class BaseSeeder<T extends RowDataPacket> {
  protected conn: mysql.Connection;

  constructor(conn: mysql.Connection) {
    this.conn = conn;
  }

  public abstract createTable(): Promise<void>;
  public abstract dropTable(): Promise<void>;
  public abstract populate(): Promise<T[]>;
}

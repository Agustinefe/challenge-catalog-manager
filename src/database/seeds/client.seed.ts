import * as mysql from 'mysql2/promise';
import data from '../../../init-data/clientes.json';
import BaseSeeder from './base.seed';
import { Client } from '../../../src/client/entities/client.entity';

export default class ClientSeeder extends BaseSeeder<Client> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS clients (
        id integer PRIMARY KEY,
        firstName varchar(255),
        lastName varchar(255),
        address varchar(255),
        cuit varchar(255)
      );
    `;
    await this.conn.execute(createTableQuery);
  }

  public async dropTable(): Promise<void> {
    const dropTableQuery = `
      DROP TABLE IF EXISTS clients;
    `;
    await this.conn.execute(dropTableQuery);
  }

  public async populate(): Promise<Client[]> {
    const clients = data.map((c) => [
      c.id,
      c.nombre,
      c.apeliido,
      c.domicilio,
      c.cuit,
    ]);

    await this.conn.query(
      'INSERT INTO clients (id, firstName, lastName, address, cuit) VALUES ?',
      [clients],
    );

    const [rows] = await this.conn.execute<(Client & mysql.RowDataPacket)[]>(
      'SELECT * FROM clients',
    );
    return rows;
  }
}

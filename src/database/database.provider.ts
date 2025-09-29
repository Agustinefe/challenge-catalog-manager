import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { dataSourceConfig } from '../../src/data-source';
import UserSeeder from './seeds/user.seed';
import UserSessionSeeder from './seeds/user-session.seed';
import ProductTypeSeeder from './seeds/product-type.seed';

@Injectable()
export class DatabaseProvider implements OnModuleInit, OnModuleDestroy {
  private _connection: mysql.Connection;

  private assertConnection() {
    if (!this._connection) {
      throw new Error(
        'Database connection not established. Make sure onModuleInit has been called.',
      );
    }
  }

  async onModuleInit() {
    await this.connect();
    await this.synchronize();
  }

  async connect() {
    if (!this._connection) {
      this._connection = await mysql.createConnection(dataSourceConfig);
    }
  }

  async onModuleDestroy() {
    if (this._connection) await this._connection.end();
  }

  get connection(): mysql.Connection {
    this.assertConnection();
    return this._connection;
  }

  async dropDatabase(): Promise<void> {
    this.assertConnection();

    const userSeeder = new UserSeeder(this._connection);
    const userSessionSeeder = new UserSessionSeeder(this._connection);
    const productTypeSeeder = new ProductTypeSeeder(this._connection);

    await userSessionSeeder.dropTable();
    await userSeeder.dropTable();

    await productTypeSeeder.dropTable();
  }

  async synchronize(): Promise<void> {
    this.assertConnection();

    const userSeeder = new UserSeeder(this._connection);
    const userSessionSeeder = new UserSessionSeeder(this._connection);
    const productTypeSeeder = new ProductTypeSeeder(this._connection);

    await userSeeder.createTable();
    await userSessionSeeder.createTable();

    await productTypeSeeder.createTable();
  }
}

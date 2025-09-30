import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { dataSourceConfig } from '../../src/data-source';
import UserSeeder from './seeds/user.seed';
import UserSessionSeeder from './seeds/user-session.seed';
import ProductTypeSeeder from './seeds/product-type.seed';
import ProductCategorySeeder from './seeds/product-category.seed';
import ProductStatusSeeder from './seeds/product-status.seed';
import ProductSeeder from './seeds/product.seed';
import PriceListSeeder from './seeds/price-list.seed';
import { DatabaseSetup } from './seeds/database-setup';

@Injectable()
export class DatabaseProvider implements OnModuleInit, OnModuleDestroy {
  private _connection: mysql.Connection;
  private setup: DatabaseSetup;

  private assertConnection() {
    if (!this._connection) {
      throw new Error(
        'Database connection not established. Make sure onModuleInit has been called.',
      );
    }
  }

  async onModuleInit() {
    await this.connect();
    if (dataSourceConfig.shouldSynchronize) await this.synchronize();
  }

  async connect() {
    if (!this._connection) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { shouldSynchronize, ...rest } = dataSourceConfig;
      this._connection = await mysql.createConnection(rest);
      this.setup = new DatabaseSetup(this._connection);
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
    await this.setup.dropTables();
  }

  async synchronize(): Promise<void> {
    this.assertConnection();
    await this.setup.createTables();
  }

  async seed(): Promise<void> {
    this.assertConnection();
    await this.setup.seedTables();
  }
}

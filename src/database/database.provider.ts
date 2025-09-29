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
    if (dataSourceConfig.shouldSynchronize) await this.synchronize();
  }

  async connect() {
    if (!this._connection) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { shouldSynchronize, ...rest } = dataSourceConfig;
      this._connection = await mysql.createConnection(rest);
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
    const productCategorySeeder = new ProductCategorySeeder(this._connection);
    const productStatusSeeder = new ProductStatusSeeder(this._connection);
    const productSeeder = new ProductSeeder(this._connection);
    const priceListSeeder = new PriceListSeeder(this._connection);

    await userSessionSeeder.dropTable();
    await userSeeder.dropTable();

    await priceListSeeder.dropTable();

    await productSeeder.dropTable();

    await productTypeSeeder.dropTable();
    await productCategorySeeder.dropTable();
    await productStatusSeeder.dropTable();
  }

  async synchronize(): Promise<void> {
    this.assertConnection();

    const userSeeder = new UserSeeder(this._connection);
    const userSessionSeeder = new UserSessionSeeder(this._connection);
    const productTypeSeeder = new ProductTypeSeeder(this._connection);
    const productCategorySeeder = new ProductCategorySeeder(this._connection);
    const productStatusSeeder = new ProductStatusSeeder(this._connection);
    const productSeeder = new ProductSeeder(this._connection);
    const priceListSeeder = new PriceListSeeder(this._connection);

    await userSeeder.createTable();
    await userSessionSeeder.createTable();

    await productTypeSeeder.createTable();
    await productCategorySeeder.createTable();
    await productStatusSeeder.createTable();

    await productSeeder.createTable();

    await priceListSeeder.createTable();
  }
}

import { Connection } from 'mysql2/promise';
import UserSeeder from './user.seed';
import UserSessionSeeder from './user-session.seed';
import ProductTypeSeeder from './product-type.seed';
import ProductCategorySeeder from './product-category.seed';
import ProductStatusSeeder from './product-status.seed';
import ProductSeeder from './product.seed';
import PriceListSeeder from './price-list.seed';
import ClientSeeder from './client.seed';
import OrderSeeder from './order.seed';

export class DatabaseSetup {
  private readonly userSeeder: UserSeeder;
  private readonly userSessionSeeder: UserSessionSeeder;
  private readonly productTypeSeeder: ProductTypeSeeder;
  private readonly productCategorySeeder: ProductCategorySeeder;
  private readonly productStatusSeeder: ProductStatusSeeder;
  private readonly productSeeder: ProductSeeder;
  private readonly priceListSeeder: PriceListSeeder;
  private readonly clientSeeder: ClientSeeder;
  private readonly orderSeeder: OrderSeeder;

  constructor(private readonly connection: Connection) {
    this.userSeeder = new UserSeeder(this.connection);
    this.userSessionSeeder = new UserSessionSeeder(this.connection);
    this.productTypeSeeder = new ProductTypeSeeder(this.connection);
    this.productCategorySeeder = new ProductCategorySeeder(this.connection);
    this.productStatusSeeder = new ProductStatusSeeder(this.connection);
    this.productSeeder = new ProductSeeder(this.connection);
    this.priceListSeeder = new PriceListSeeder(this.connection);
    this.clientSeeder = new ClientSeeder(this.connection);
    this.orderSeeder = new OrderSeeder(this.connection);
  }

  async dropTables(): Promise<void> {
    await this.userSessionSeeder.dropTable();
    await this.userSeeder.dropTable();

    await this.orderSeeder.dropTable();
    await this.clientSeeder.dropTable();
    await this.priceListSeeder.dropTable();
    await this.productSeeder.dropTable();
    await this.productTypeSeeder.dropTable();
    await this.productCategorySeeder.dropTable();
    await this.productStatusSeeder.dropTable();
  }

  async createTables(): Promise<void> {
    await this.userSeeder.createTable();
    await this.userSessionSeeder.createTable();

    await this.productTypeSeeder.createTable();
    await this.productCategorySeeder.createTable();
    await this.productStatusSeeder.createTable();
    await this.productSeeder.createTable();
    await this.priceListSeeder.createTable();
    await this.clientSeeder.createTable();
    await this.orderSeeder.createTable();
  }

  async seedTables(): Promise<void> {
    await this.userSeeder.populate();

    await this.productTypeSeeder.populate();
    await this.productCategorySeeder.populate();
    await this.productStatusSeeder.populate();
    await this.productSeeder.populate();
    await this.priceListSeeder.populate();
    await this.clientSeeder.populate();
    await this.orderSeeder.populate();
  }
}

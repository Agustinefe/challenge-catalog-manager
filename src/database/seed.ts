import * as mysql from 'mysql2/promise';
import { dataSourceConfig } from '../../src/data-source';
import UserSeeder from './seeds/user.seed';
import UserSessionSeeder from './seeds/user-session.seed';
import ProductTypeSeeder from './seeds/product-type.seed';
import ProductCategorySeeder from './seeds/product-category.seed';

async function run() {
  const connection = await mysql.createConnection(dataSourceConfig);

  const userSeeder = new UserSeeder(connection);
  const userSessionSeeder = new UserSessionSeeder(connection);
  const productTypeSeeder = new ProductTypeSeeder(connection);
  const productCategorySeeder = new ProductCategorySeeder(connection);

  await userSessionSeeder.dropTable();
  await userSeeder.dropTable();
  await productTypeSeeder.dropTable();
  await productCategorySeeder.dropTable();

  await userSeeder.createTable();
  await userSessionSeeder.createTable();
  await productTypeSeeder.createTable();
  await productCategorySeeder.createTable();

  await userSeeder.populate();
  await productTypeSeeder.populate();
  await productCategorySeeder.populate();

  await connection.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

import * as mysql from 'mysql2/promise';
import { dataSourceConfig } from '../../src/data-source';
import UserSeeder from './seeds/user.seed';
import UserSessionSeeder from './seeds/user-session.seed';

async function run() {
  const connection = await mysql.createConnection(dataSourceConfig);

  const userSeeder = new UserSeeder(connection);
  const userSessionSeeder = new UserSessionSeeder(connection);

  await userSessionSeeder.dropTable();
  await userSeeder.dropTable();

  await userSeeder.createTable();
  await userSeeder.populate();

  await userSessionSeeder.createTable();

  await connection.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

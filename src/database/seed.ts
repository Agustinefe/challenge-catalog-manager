import * as mysql from 'mysql2/promise';
import { dataSourceConfig } from '../../src/data-source';
import { DatabaseSetup } from './seeds/database-setup';

async function run() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { shouldSynchronize, ...rest } = dataSourceConfig;
  const connection = await mysql.createConnection(rest);
  const seeder = new DatabaseSetup(connection);

  await seeder.dropTables();
  await seeder.createTables();
  await seeder.seedTables();

  await connection.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

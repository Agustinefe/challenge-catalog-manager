import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql2';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '3306');
const user = process.env.DB_USER || 'mysql';
const password = process.env.DB_PASSWORD || 'password';
const database = process.env.DB_NAME || 'catalog-manager-challenge';
const shouldSynchronize = process.env.DB_SYNCHRONIZE === 'true';

// Create data source configuration
export const dataSourceConfig: ConnectionOptions & {
  shouldSynchronize: boolean;
} = {
  host,
  port,
  user,
  password,
  database,
  shouldSynchronize,
};

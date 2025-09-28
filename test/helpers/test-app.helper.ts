import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DatabaseProvider } from '../../src/database/database.provider';
import { Connection } from 'mysql2/promise';

export class TestHelper {
  app: INestApplication;
  private dataSource: DatabaseProvider;

  private constructor(app: INestApplication, dataSource: DatabaseProvider) {
    this.app = app;
    this.dataSource = dataSource;
  }

  public static async initTestApp(): Promise<TestHelper> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    // First, get the DataSource and initialize it before using it
    const dataSource = moduleFixture.get<DatabaseProvider>(DatabaseProvider);

    // Manually initialize the database connection
    await dataSource.connect();

    // Now we can safely use dropDatabase and synchronize
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Initialize the app
    await app.init();
    return new TestHelper(app, dataSource);
  }

  get db(): Connection {
    return this.dataSource.connection;
  }

  public async closeTestApp(): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.app.close();
  }

  public async resetTestApp(): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
  }
}

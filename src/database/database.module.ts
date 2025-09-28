import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';

@Module({
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly provider: DatabaseProvider) { }

  async onModuleInit() {
    await this.provider.onModuleInit();
  }
}

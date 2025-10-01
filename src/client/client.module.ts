import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { DatabaseModule } from '../../src/database/database.module';
import { ClientRepository } from './client.repository';

@Module({
  imports: [DatabaseModule],
  providers: [ClientService, ClientRepository],
  exports: [ClientService],
})
export class ClientModule { }

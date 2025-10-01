import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../src/database/database.provider';
import { HandleDBExceptions } from 'src/database/decorators';
import { RowDataPacket } from 'mysql2';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientRepository {
  constructor(private db: DatabaseProvider) { }

  @HandleDBExceptions()
  async findOne(id: number): Promise<Client | null> {
    const [rows] = await this.db.connection.execute<(Client & RowDataPacket)[]>(
      'SELECT * FROM `clients` WHERE `id` = ? LIMIT 1',
      [id],
    );

    return rows.length === 0 ? null : rows[0];
  }
}

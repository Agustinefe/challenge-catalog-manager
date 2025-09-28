import { Injectable } from '@nestjs/common';
import { UserSession } from './entities/user-session.entity';
import { HandleDBExceptions } from '../database/decorators';
import { DatabaseProvider } from '../../src/database/database.provider';
import { replaceAsteriskWithFields } from '../../src/common/sql.utils';
import { UserSessionModel } from './models/user-session.model';

@Injectable()
export class UserSessionRepository {
  constructor(private db: DatabaseProvider) { }

  @HandleDBExceptions()
  async findOne(
    tokenId: string,
    select?: (keyof UserSession)[],
  ): Promise<UserSession | null> {
    const query = replaceAsteriskWithFields(
      'SELECT * FROM `user_sessions` WHERE `tokenId` = ? LIMIT 1',
      select,
    );
    const [rows] = await this.db.connection.execute<UserSessionModel[]>(query, [
      tokenId,
    ]);

    return rows.length === 0 ? null : rows[0];
  }

  @HandleDBExceptions()
  async create(data: UserSession): Promise<UserSession> {
    const query =
      'INSERT INTO user_sessions (tokenId, userId, expiryDate) VALUES (?, ?, ?)';
    await this.db.connection.execute(query, [
      data.tokenId,
      data.userId,
      data.expiryDate,
    ]);

    return (await this.findOne(data.tokenId))!;
  }

  async deleteByToken(tokenId: string): Promise<void> {
    const query = 'DELETE FROM `user_sessions` WHERE `tokenId` = ? LIMIT 1';
    await this.db.connection.execute(query, [tokenId]);
  }
}

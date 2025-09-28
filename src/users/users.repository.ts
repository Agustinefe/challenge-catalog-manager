import { Injectable } from '@nestjs/common';
import { type User } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { HandleDBExceptions } from '../database/decorators';
import { DatabaseProvider } from '../../src/database/database.provider';
import { ResultSetHeader } from 'mysql2/promise';
import { UserModel } from './models';
import { replaceAsteriskWithFields } from '../../src/common/sql.utils';

@Injectable()
export class UsersRepository {
  constructor(private db: DatabaseProvider) { }

  @HandleDBExceptions()
  async findAll(select?: (keyof User)[]): Promise<User[]> {
    const query = replaceAsteriskWithFields(`SELECT * FROM users`, select);
    const [rows] = await this.db.connection.query<UserModel[]>(query);
    return rows;
  }

  @HandleDBExceptions()
  async findOne(id: number, select?: (keyof User)[]): Promise<User | null> {
    const query = replaceAsteriskWithFields(
      'SELECT * FROM `users` WHERE `id` = ? LIMIT 1',
      select,
    );
    const [rows] = await this.db.connection.execute<UserModel[]>(query, [id]);

    return rows.length === 0 ? null : rows[0];
  }

  @HandleDBExceptions()
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM `users` WHERE `email` = ? LIMIT 1';
    const [rows] = await this.db.connection.execute<UserModel[]>(query, [
      email,
    ]);
    return rows.length === 0 ? null : rows[0];
  }

  @HandleDBExceptions()
  async create(user: CreateUserDto): Promise<User> {
    const query =
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const [result] = await this.db.connection.execute<ResultSetHeader>(query, [
      user.username,
      user.email,
      user.password,
    ]);

    return (await this.findOne(result.insertId))!;
  }

  @HandleDBExceptions()
  async update(id: number, user: UpdateUserDto): Promise<User | null> {
    const columns = Object.keys(user)
      .map((col) => `${col} = ?`)
      .join(', ');
    const values = Object.values(user);

    const query = `UPDATE users SET ${columns} WHERE id = ?`;
    await this.db.connection.execute(query, [...values, id]);

    return this.findOne(id);
  }

  @HandleDBExceptions()
  async remove({ id }: User): Promise<void> {
    const query = 'DELETE FROM `users` WHERE `id` = ? LIMIT 1';
    await this.db.connection.execute(query, [id]);
  }
}

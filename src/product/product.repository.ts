import { Injectable } from '@nestjs/common';
import { HandleDBExceptions } from '../database/decorators';
import { DatabaseProvider } from '../../src/database/database.provider';
import { PaginationDto } from './dto/pagination.dto';
import { RowDataPacket } from 'mysql2';
import { ListProductsDto } from './dto/list-products.dto';

@Injectable()
export class ProductRepository {
  constructor(private db: DatabaseProvider) { }
  private sortMapper = {
    category: 'pc.code',
    price: 'pl.price',
  };

  @HandleDBExceptions()
  async findManyPaginated({
    sortBy,
    sortOrder,
    page,
    pageSize,
  }: PaginationDto): Promise<ListProductsDto[]> {
    const sortColumn = this.sortMapper[sortBy as 'category'];
    console.log(sortColumn, sortOrder);

    const query = `
      SELECT 
        p.*, 
        JSON_OBJECT(
          'id', pl.id,
          'price', pl.price
        ) AS currentPrice,
        JSON_OBJECT(
          'id', pc.id,
          'code', pc.code,
          'description', pc.description
        ) AS category 
      FROM products as p
      INNER JOIN price_list as pl ON p.id = pl.productId
      INNER JOIN product_category as pc ON p.productCategoryId = pc.id
      WHERE
        p.qty > 0 
        AND p.productStateId = 3 
        AND p.imageUrl IS NOT NULL
        AND pl.price IS NOT NULL AND pl.price > 0
        AND pl.fromDate < CURRENT_DATE() AND pl.toDate > CURRENT_DATE()
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ?, ?;
      `;

    const [rows] = await this.db.connection.query<
      (ListProductsDto & RowDataPacket)[]
    >(query, [(page - 1) * pageSize, pageSize]);

    return rows;
  }
}

import { Injectable } from '@nestjs/common';
import { HandleDBExceptions } from '../database/decorators';
import { DatabaseProvider } from '../../src/database/database.provider';
import { RowDataPacket } from 'mysql2';
import { ListProductsDto } from './dto/list-products.dto';
import { ProductSortColumn } from './entities/product-sort-column.entity';
import { ListProductPaginationDto } from './dto/list-products-pagination.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(private db: DatabaseProvider) { }
  private sortMapper: Record<ProductSortColumn, string> = {
    category: 'pc.code',
    price: 'pl.price',
  };

  @HandleDBExceptions()
  async listProductsPaginated({
    sortBy,
    sortOrder,
    page,
    pageSize,
  }: ListProductPaginationDto): Promise<{
    total: number;
    rows: ListProductsDto[];
  }> {
    const sortColumn = sortBy ? this.sortMapper[sortBy] : 'p.id';

    const where = `
      WHERE
        p.qty > 0 
        AND p.productStateId = 3 
        AND p.imageUrl IS NOT NULL
        AND pl.price IS NOT NULL AND pl.price > 0
        AND pl.fromDate < CURRENT_DATE() AND pl.toDate > CURRENT_DATE()
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      INNER JOIN price_list pl ON p.id = pl.productId
      INNER JOIN product_category pc ON p.productCategoryId = pc.id
      ${where} 
    `;

    const dataQuery = `
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
      ${where}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ?, ?;
      `;

    const [[{ total }]] =
      await this.db.connection.query<({ total: number } & RowDataPacket)[]>(
        countQuery,
      );

    const [rows] = await this.db.connection.query<
      (ListProductsDto & RowDataPacket)[]
    >(dataQuery, [(page - 1) * pageSize, pageSize]);

    return { total, rows };
  }

  async findProductBySlug(slug: string): Promise<Product | null> {
    const query = `
      SELECT * FROM products
      WHERE slug = ?
      LIMIT 1
    `;

    const [rows] = await this.db.connection.query<(Product & RowDataPacket)[]>(
      query,
      [slug],
    );

    return rows.length === 0 ? null : rows[0];
  }

  async findNProductsNearToSlug(
    slug: string,
    limit: number,
  ): Promise<Product[]> {
    const beforeQuery = `
      SELECT * FROM products 
      WHERE slug < ?
      ORDER BY slug DESC 
      LIMIT ?
    `;

    const afterQuery = `
      SELECT * FROM products 
      WHERE slug > ?
      ORDER BY slug ASC 
      LIMIT ?
    `;

    const beforeLimit = Math.floor(limit / 2);
    const afterLimit = limit - beforeLimit;

    const [before] = await this.db.connection.query<
      (Product & RowDataPacket)[]
    >(beforeQuery, [slug, beforeLimit]);

    const [after] = await this.db.connection.query<(Product & RowDataPacket)[]>(
      afterQuery,
      [slug, afterLimit],
    );

    return before.concat(after);
  }

  async getProductsBySkuAndDescription(
    { sortBy, sortOrder, page, pageSize }: ListProductPaginationDto,
    sku?: string,
    description?: string,
  ): Promise<{
    total: number;
    rows: ListProductsDto[];
  }> {
    const sortColumn = sortBy ? this.sortMapper[sortBy] : 'p.id';
    const filters = [];

    if (sku) {
      filters.push(`p.sku LIKE '%${sku}%'`);
    }

    if (description) {
      filters.push(
        `p.shortDescription LIKE '%${description}%' OR p.longDescription LIKE '%${description}%'`,
      );
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(' OR ')}` : '';

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      LEFT JOIN price_list pl ON p.id = pl.productId
      LEFT JOIN product_category pc ON p.productCategoryId = pc.id
      ${where} 
    `;

    const dataQuery = `
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
      LEFT JOIN price_list as pl ON p.id = pl.productId
      LEFT JOIN product_category as pc ON p.productCategoryId = pc.id
      ${where}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${(page - 1) * pageSize}, ${pageSize};
    `;

    const [[{ total }]] =
      await this.db.connection.query<({ total: number } & RowDataPacket)[]>(
        countQuery,
      );

    const [rows] =
      await this.db.connection.query<(ListProductsDto & RowDataPacket)[]>(
        dataQuery,
      );

    return { total, rows };
  }
}

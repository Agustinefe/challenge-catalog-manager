import { Injectable } from '@nestjs/common';
import { HandleDBExceptions } from '../database/decorators';
import { DatabaseProvider } from '../../src/database/database.provider';
import { RowDataPacket } from 'mysql2';
import { ListProductsDto } from './dto/list-products.dto';
import { ProductSortColumn } from './entities/product-sort-column.entity';
import { ListProductPaginationDto } from './dto/list-products-pagination.dto';
import { Product } from './entities/product.entity';
import { ProductDetailsDto } from './dto/product-details.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductRepository {
  constructor(private db: DatabaseProvider) { }
  private sortMapper: Record<ProductSortColumn, string> = {
    category: 'pc.code',
    price: 'pl.price',
    creationDate: 'p.createdAt',
  };

  @HandleDBExceptions()
  async findOne(id: number): Promise<Product | null> {
    const [rows] = await this.db.connection.execute<
      (Product & RowDataPacket)[]
    >('SELECT * FROM products WHERE `id` = ? LIMIT 1', [id]);

    return rows.length === 0 ? null : rows[0];
  }

  /**
   * Finds a product with all the details (category, current price and status)
   *
   * @param {string} id - The product identifier
   * @returns {Promise<ProductDetailsDto | null>} The product with its details, or null if there is no product.
   */
  @HandleDBExceptions()
  async findProductWithDetails(id: number): Promise<ProductDetailsDto | null> {
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
        ) AS category,  
        JSON_OBJECT(
          'id', ps.id,
          'description', ps.description
        ) AS state  
      FROM products p
      INNER JOIN price_list pl ON p.id = pl.productId
      INNER JOIN product_category pc ON p.productCategoryId = pc.id
      INNER JOIN product_status ps ON p.productStateId = ps.id
      WHERE 
        p.id = ?
        AND pl.fromDate < CURRENT_DATE() AND pl.toDate > CURRENT_DATE()
      LIMIT 1
    `;
    const [rows] = await this.db.connection.execute<
      (ProductDetailsDto & RowDataPacket)[]
    >(query, [id]);
    return rows.length === 0 ? null : rows[0];
  }

  /**
   * Finds the active products. This function is paginated.
   *
   * @param {ListProductPaginationDto} pagination - Pagination metadata
   * @returns {Promise<{total: number;rows: ListProductsDto[];}>} The product page, with the total found.
   */
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

  @HandleDBExceptions()
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

  /**
   * Finds N products near to the given slug.
   *
   * First, order the product and split the list by the product with the given slug. Then take the N/2 products that come before,
   * and the N/2 products that come after.
   *
   * This algorithm works even if there is no product with the given slug, so it's suitable for fetching alternative products.
   *
   * @param {string} slug - The given slug to find related products
   * @param {string | undefined} limit - The number of related products to fetch
   * @returns {Promise<Product[]>} The related products.
   */
  @HandleDBExceptions()
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

  /**
   * Finds products by sku and/or description. This function is paginated.
   *
   * @param {ListProductPaginationDto} pagination - Pagination metadata
   * @param {string | undefined} sku - The given sku to filter by
   * @param {string | undefined} sku - The given description to filter by
   * @returns {Promise<{total: number;rows: ListProductsDto[];}>} The product page, with the total found.
   */
  @HandleDBExceptions()
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

  @HandleDBExceptions()
  async update(id: number, product: UpdateProductDto): Promise<Product | null> {
    const columns = Object.keys(product)
      .map((col) => `${col} = ?`)
      .join(', ');
    const values = Object.values(product);

    const query = `UPDATE products SET ${columns} WHERE id = ?`;
    await this.db.connection.execute(query, [...values, id]);

    return this.findOne(id);
  }
}

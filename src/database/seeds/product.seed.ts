import * as mysql from 'mysql2/promise';
import data from '../../../init-data/productos.json';
import BaseSeeder from './base.seed';
import { Product } from '../../../src/product/entities/product.entity';

export default class ProductSeeder extends BaseSeeder<Product> {
  constructor(conn: mysql.Connection) {
    super(conn);
  }

  // Implemented by Sling Academy in https://www.slingacademy.com/article/javascript-how-to-convert-a-string-to-a-url-slug/#using-regular-expressions
  private generateSlug(longDescription: string): string {
    return longDescription
      .trim()
      .toLowerCase()
      .replace(/[\W_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  public async createTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id integer AUTO_INCREMENT PRIMARY KEY,
        sku varchar(255),
        shortDescription varchar(255),
        longDescription varchar(255),
        slug varchar(255),
        qty integer,
        imageUrl varchar(255),
        productTypeId integer NOT NULL,
        productCategoryId integer NOT NULL,
        productStateId integer NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.conn.execute(createTableQuery);
    await this.conn.execute(
      'ALTER TABLE products ADD FOREIGN KEY (`productStateId`) REFERENCES `product_status` (`id`);',
    );
    await this.conn.execute(
      'ALTER TABLE products ADD FOREIGN KEY (`productTypeId`) REFERENCES `product_type` (`id`);',
    );
    await this.conn.execute(
      'ALTER TABLE products ADD FOREIGN KEY (`productCategoryId`) REFERENCES `product_category` (`id`);',
    );
  }

  public async dropTable(): Promise<void> {
    const dropTableQuery = `
      DROP TABLE IF EXISTS products;
    `;
    await this.conn.execute(dropTableQuery);
  }

  public async populate(): Promise<Product[]> {
    const products = data.map((u) => [
      u.id,
      u.sku,
      u.descripcion_corta,
      u.descripcion_larga,
      this.generateSlug(u.descripcion_larga),
      u.qty,
      u.ubicacion_imagen,
      u.producto_tipo_id,
      u.producto_categoria_id,
      u.producto_estado_id,
      u.fecha_creacion,
    ]);

    const columns = [
      'id',
      'sku',
      'shortDescription',
      'longDescription',
      'slug',
      'qty',
      'imageUrl',
      'productTypeId',
      'productCategoryId',
      'productStateId',
      'createdAt',
    ];

    await this.conn.query(
      `INSERT INTO products (${columns.join(', ')}) VALUES ?`,
      [products],
    );

    const [rows] = await this.conn.execute<(Product & mysql.RowDataPacket)[]>(
      'SELECT * FROM products',
    );
    return rows;
  }
}

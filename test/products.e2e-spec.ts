/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ListProductsResponseDto } from 'src/product/dto/list-products.response.dto';

describe('ProductsController (e2e)', () => {
  let context: TestHelper;
  let jwtService: JwtService;
  let commonAccessToken: string;

  beforeAll(async () => {
    context = await TestHelper.initTestApp();

    jwtService = new JwtService({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    });
  });

  afterAll(async () => {
    await context.closeTestApp();
  });

  beforeEach(async () => {
    commonAccessToken = jwtService.sign({
      username: 'user1',
      email: 'user1@example.com',
      tokenId: uuidv4(),
    });
    await context.resetTestApp();
  });

  describe('GET /product', () => {
    it('should return an empty array when no products exists', async () => {
      const response = await request(context.app.getHttpServer())
        .get('/product?page=1&pageSize=5&sortBy=price&sortOrder=DESC')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);

      const responseBody = response.body as ListProductsResponseDto;
      expect(responseBody.data).toEqual([]);
    });

    it('should return the first page with two products', async () => {
      await context.seedTestApp();
      const response = await request(context.app.getHttpServer())
        .get('/product?page=1&pageSize=2')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);

      const responseBody = response.body as ListProductsResponseDto;
      expect(responseBody.data.length).toBe(2);
      expect(responseBody.meta.totalItems).toBe(3);
      expect(responseBody.meta.pageSize).toBe(2);

      expect(responseBody.data.every((p) => p.qty && p.qty > 0)).toBeTruthy();
      expect(
        responseBody.data.every((p) => p.productStateId === 3),
      ).toBeTruthy();
      expect(responseBody.data.every((p) => p.imageUrl)).toBeTruthy();
      expect(
        responseBody.data.every((p) => p.currentPrice.price > 0),
      ).toBeTruthy();
    });

    it('should return the second page with just one products', async () => {
      await context.seedTestApp();
      const response = await request(context.app.getHttpServer())
        .get('/product?page=2&pageSize=2')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);

      const responseBody = response.body as ListProductsResponseDto;
      expect(responseBody.data.length).toBe(1);
      expect(responseBody.meta.totalItems).toBe(3);
      expect(responseBody.meta.pageSize).toBe(2);

      expect(responseBody.data.every((p) => p.qty && p.qty > 0)).toBeTruthy();
      expect(
        responseBody.data.every((p) => p.productStateId === 3),
      ).toBeTruthy();
      expect(responseBody.data.every((p) => p.imageUrl)).toBeTruthy();
      expect(
        responseBody.data.every((p) => p.currentPrice.price > 0),
      ).toBeTruthy();
    });

    it('should throw Bad Request Exception when pagination is not present', async () => {
      await request(context.app.getHttpServer())
        .get('/product?pageSize=2')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(400);

      await request(context.app.getHttpServer())
        .get('/product?page=1')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(400);
    });

    it('should throw Bad Request Exception when pagination is not a number', async () => {
      await request(context.app.getHttpServer())
        .get('/product?page=abc&pageSize=2')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(400);

      await request(context.app.getHttpServer())
        .get('/product?page=2&pageSize=abc')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(400);
    });

    it('should return data ordered by price descending', async () => {
      await context.seedTestApp();

      const response = await request(context.app.getHttpServer())
        .get('/product?page=1&pageSize=5&sortBy=price&sortOrder=DESC')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);

      const responseBody = response.body as ListProductsResponseDto;
      expect(responseBody.data.length).not.toBe(0);
      const priceArray = responseBody.data.map((p) => p.currentPrice.price);
      const isOrderedByPrice = priceArray.every((current, idx) =>
        idx === 0 ? true : current <= priceArray[idx - 1],
      );
      expect(isOrderedByPrice).toBeTruthy();
    });

    it('should return data ordered by category ascending', async () => {
      await context.seedTestApp();

      const response = await request(context.app.getHttpServer())
        .get('/product?page=1&pageSize=5&sortBy=category')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);

      const responseBody = response.body as ListProductsResponseDto;
      expect(responseBody.data.length).not.toBe(0);
      const categoryArray = responseBody.data.map((p) => p.category.code);
      const isOrderedByCategory = categoryArray.every((current, idx) =>
        idx === 0 ? true : current >= categoryArray[idx - 1],
      );
      expect(isOrderedByCategory).toBeTruthy();
    });
  });
});

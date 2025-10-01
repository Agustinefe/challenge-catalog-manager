/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { ListProductsResponseDto } from '../src/product/dto/list-products.response.dto';

describe('SearchController (e2e)', () => {
  let context: TestHelper;
  let commonAccessToken: string;

  beforeAll(async () => {
    context = await TestHelper.initTestApp();
  });

  afterAll(async () => {
    await context.closeTestApp();
  });

  beforeEach(async () => {
    commonAccessToken = context.generateAccessToken({
      id: 1,
      email: 'user1@example.com',
    });
    await context.resetTestApp();
  });

  describe('GET /search', () => {
    it('should return an empty array when no products exists', async () => {
      const response = await request(context.app.getHttpServer())
        .get(
          '/search?sku=argentina&page=1&pageSize=5&sortBy=price&sortOrder=DESC',
        )
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);

      const responseBody = response.body as ListProductsResponseDto;
      expect(responseBody.data).toEqual([]);
    });

    it('should return the first page with two products which sku includes the search', async () => {
      await context.seedTestApp();
      const search = 'pop';

      const response = await request(context.app.getHttpServer())
        .get(
          `/search?sku=${search}&page=1&pageSize=2&sortBy=price&sortOrder=DESC`,
        )
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(200);

      const responseBody = response.body as ListProductsResponseDto;
      expect(responseBody.data.length).toBe(2);
      expect(responseBody.meta.totalItems).toBe(2);
      expect(responseBody.meta.pageSize).toBe(2);
      expect(
        responseBody.data
          .map((p) => p.sku)
          .every((sku) => sku.toLowerCase().includes(search)),
      ).toBeTruthy();
    });

    it('should return the first and second page with two products which description includes the search', async () => {
      await context.seedTestApp();
      const search = 'argentin';

      for (let i = 1; i < 3; i++) {
        const response = await request(context.app.getHttpServer())
          .get(
            `/search?description=${search}&page=${i}&pageSize=2&sortBy=price&sortOrder=DESC`,
          )
          .set('Authorization', `Bearer ${commonAccessToken}`)
          .expect(200);

        const responseBody = response.body as ListProductsResponseDto;
        expect(responseBody.data.length).toBe(2);
        expect(responseBody.meta.totalItems).toBe(4);
        expect(responseBody.meta.pageSize).toBe(2);

        expect(
          responseBody.data.every(
            ({ shortDescription, longDescription }) =>
              shortDescription.toLowerCase().includes(search) ||
              longDescription.toLowerCase().includes(search),
          ),
        ).toBeTruthy();
      }
    });

    it('should throw Bad Request Exception when pagination is not present', async () => {
      await request(context.app.getHttpServer())
        .get('/search?pageSize=2')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(400);

      await request(context.app.getHttpServer())
        .get('/search?page=1')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(400);
    });

    it('should throw Bad Request Exception when pagination is not a number', async () => {
      await request(context.app.getHttpServer())
        .get('/search?page=abc&pageSize=2')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(400);

      await request(context.app.getHttpServer())
        .get('/search?page=2&pageSize=abc')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .expect(400);
    });

    it('should return data ordered by price descending', async () => {
      await context.seedTestApp();
      const search = 'argentin';

      const response = await request(context.app.getHttpServer())
        .get(
          `/search?description=${search}&page=1&pageSize=4&sortBy=price&sortOrder=DESC`,
        )
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
      const search = 'argentin';

      const response = await request(context.app.getHttpServer())
        .get(`/search?description=${search}&page=1&pageSize=5&sortBy=category`)
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

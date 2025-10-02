/* eslint-disable @typescript-eslint/no-unsafe-argument */
import request from 'supertest';
import { TestHelper } from './helpers/test-app.helper';
import { ListProductsResponseDto } from '../src/product/dto/list-products.response.dto';
import { CreateOrderDto, OrderDto } from 'src/order/dto';
import { Client } from 'src/client/entities/client.entity';
import { RowDataPacket } from 'mysql2';
import { SearchOrdersQueryDto } from 'src/order/dto/search-orders-query.dto';
import { Product } from 'src/product/entities/product.entity';

describe('OrderController (e2e)', () => {
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

  describe('GET /order', () => {
    it('should return an empty array when no order exists', async () => {
      const response = await request(context.app.getHttpServer())
        .get('/order')
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .query({ cuit: '1111111111' })
        .expect(200);

      const responseBody = response.body as OrderDto[];
      expect(responseBody).toEqual([]);
    });

    it('should return the order with id 4', async () => {
      await context.seedTestApp();
      const originalOrder: OrderDto = {
        id: 4,
        clientId: 2,
        productId: 5,
        price: 45.0,
        issueDate: new Date('2025-12-01T00:00:00.000Z'),
        requestedAmount: 45,
        appliedPaymentCondition: 'FAC',
        deliveryClass: 'REP',
      };

      const { id } = originalOrder;
      const response = await request(context.app.getHttpServer())
        .get(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .query({ id })
        .expect(200);

      const responseBody = response.body as OrderDto[];
      expect(responseBody.length).toBe(1);

      const order = responseBody[0];
      expect(order.id).toBe(id);
      expect(new Date(order.issueDate).getTime()).toBe(
        originalOrder.issueDate.getTime(),
      );
      expect(order.requestedAmount).toBe(originalOrder.requestedAmount);
      expect(order.clientId).toBe(originalOrder.clientId);
      expect(order.productId).toBe(originalOrder.productId);
      expect(order.price).toBe(originalOrder.price);
      expect(order.appliedPaymentCondition).toBe(
        originalOrder.appliedPaymentCondition,
      );
      expect(order.deliveryClass).toBe(originalOrder.deliveryClass);
    });

    it('should not return nothing when id does not exists', async () => {
      await context.seedTestApp();

      const response = await request(context.app.getHttpServer())
        .get(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .query({ id: 99 })
        .expect(200);

      const responseBody = response.body as OrderDto[];
      expect(responseBody.length).toBe(0);
    });

    it('should return the orders by cuit', async () => {
      await context.seedTestApp();

      const [rows] = await context.db.query<(Client & RowDataPacket)[]>(
        'SELECT * FROM clients WHERE id = 1 LIMIT 1',
      );
      expect(rows.length).toBe(1);
      const { cuit, id } = rows[0];

      const response = await request(context.app.getHttpServer())
        .get(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .query({ cuit })
        .expect(200);

      const orders = response.body as OrderDto[];
      expect(orders.length).toBe(2);
      expect(orders.every((o) => o.clientId === id)).toBeTruthy();
    });

    it('should return the orders between the given issue dates', async () => {
      await context.seedTestApp();

      const query: SearchOrdersQueryDto = {
        createdAtMin: new Date(2025, 10, 1),
        createdAtMax: new Date(2025, 11, 1),
      };

      const response = await request(context.app.getHttpServer())
        .get(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .query(query)
        .expect(200);

      const orders = response.body as OrderDto[];
      expect(orders.length).toBe(3);
      expect(
        orders
          .map((o) => ({ ...o, issueDate: new Date(o.issueDate) }))
          .every(
            (o) =>
              query.createdAtMin!.getTime() <= o.issueDate.getTime() &&
              query.createdAtMax!.getTime() >= o.issueDate.getTime(),
          ),
      ).toBeTruthy();
    });
  });

  describe('POST /order', () => {
    it('should create a new order for product with id 3 and client with id 1', async () => {
      await context.seedTestApp();

      const data: CreateOrderDto = {
        productId: 3,
        clientId: 1,
        requestedAmount: 5,
        deliveryClass: 'EXP',
        appliedPaymentCondition: 'CASH',
      };

      const response = await request(context.app.getHttpServer())
        .post(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(data)
        .expect(201);

      const order = response.body as OrderDto;

      expect(order.productId).toBe(data.productId);
      expect(order.clientId).toBe(data.clientId);
      expect(order.requestedAmount).toBe(data.requestedAmount);
      expect(order.deliveryClass).toBe(data.deliveryClass);
      expect(order.appliedPaymentCondition).toBe(data.appliedPaymentCondition);
    });

    it('should throw Not Found Exception if product does not exists', async () => {
      await context.seedTestApp();

      const data: CreateOrderDto = {
        productId: 99,
        clientId: 1,
        requestedAmount: 5,
        deliveryClass: 'EXP',
        appliedPaymentCondition: 'CASH',
      };

      const response = await request(context.app.getHttpServer())
        .post(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(data)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: `Product with ID ${data.productId} was not found or does not have a price`,
        error: 'Not Found',
      });
    });

    it('should throw Not Found Exception if client does not exists', async () => {
      await context.seedTestApp();

      const data: CreateOrderDto = {
        productId: 3,
        clientId: 99,
        requestedAmount: 5,
        deliveryClass: 'EXP',
        appliedPaymentCondition: 'CASH',
      };

      const response = await request(context.app.getHttpServer())
        .post(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(data)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: `Client with ID 99 not found`,
        error: 'Not Found',
      });
    });

    it('should throw Bad Request Exception if product is out of stock', async () => {
      await context.seedTestApp();

      const data: CreateOrderDto = {
        productId: 10,
        clientId: 99,
        requestedAmount: 5,
        deliveryClass: 'EXP',
        appliedPaymentCondition: 'CASH',
      };

      const response = await request(context.app.getHttpServer())
        .post(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(data)
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: `Product with id ${data.productId} is out of stock`,
        error: 'Bad Request',
      });
    });

    it('should throw Bad Request Exception if product does not have stock enough', async () => {
      await context.seedTestApp();

      const data: CreateOrderDto = {
        productId: 2,
        clientId: 1,
        requestedAmount: 99,
        deliveryClass: 'EXP',
        appliedPaymentCondition: 'CASH',
      };

      const response = await request(context.app.getHttpServer())
        .post(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(data)
        .expect(400);

      expect(response.body).toEqual({
        statusCode: 400,
        message: `Product with id ${data.productId} does not have enough stock to satisfy the order`,
        error: 'Bad Request',
      });
    });

    it('should throw Not Found Exception because the product does not have a price', async () => {
      await context.seedTestApp();

      const [rows] = await context.db.query<(Product & RowDataPacket)[]>(
        'SELECT * FROM products WHERE id = 9 LIMIT 1',
      );
      expect(rows.length).toBe(1);

      const data: CreateOrderDto = {
        productId: 9,
        clientId: 2,
        requestedAmount: 5,
        deliveryClass: 'EXP',
        appliedPaymentCondition: 'CASH',
      };

      const response = await request(context.app.getHttpServer())
        .post(`/order`)
        .set('Authorization', `Bearer ${commonAccessToken}`)
        .send(data)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: `Product with ID ${data.productId} was not found or does not have a price`,
        error: 'Not Found',
      });
    });
  });
});

import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/ApiHelper';
import { ApiData } from '../../data/testData';

test.describe('Simple Books API Tests', () => {
  let apiHelper: ApiHelper;
  let accessToken: string;
  let createdOrderId: string;
  const availableBookId = 1;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request, ApiData.baseUrl);
    // Register and get token for each test
    accessToken = await apiHelper.registerClient(ApiData.clientName, ApiData.clientEmail);
  });

  // ── Status ────────────────────────────────────────────────────────────────

  test('TC_API_01 - GET /status returns OK', async () => {
    const { status, body } = await apiHelper.getApiStatus();
    expect(status).toBe(200);
    expect(body.status).toBe('OK');
  });

  // ── Books ─────────────────────────────────────────────────────────────────

  test('TC_API_02 - GET /books returns list of books', async () => {
    const { status, body } = await apiHelper.getAllBooks();
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('TC_API_03 - GET /books?type=fiction returns only fiction books', async () => {
    const { status, body } = await apiHelper.getAllBooks('fiction');
    expect(status).toBe(200);
    body.forEach((book: { type: string }) => {
      expect(book.type).toBe('fiction');
    });
  });

  test('TC_API_04 - GET /books?type=non-fiction returns only non-fiction books', async () => {
    const { status, body } = await apiHelper.getAllBooks('non-fiction');
    expect(status).toBe(200);
    body.forEach((book: { type: string }) => {
      expect(book.type).toBe('non-fiction');
    });
  });

  test('TC_API_05 - GET /books/:id returns book details', async () => {
    const { status, body } = await apiHelper.getBookById(availableBookId);
    expect(status).toBe(200);
    expect(body).toHaveProperty('id', availableBookId);
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('type');
    expect(body).toHaveProperty('available');
  });

  test('TC_API_06 - GET /books/:id with invalid id returns 404', async () => {
    const { status } = await apiHelper.getBookById(9999);
    expect(status).toBe(404);
  });

  // ── Auth ──────────────────────────────────────────────────────────────────

  test('TC_API_07 - POST /api-clients returns access token', async () => {
    expect(accessToken).toBeTruthy();
    expect(typeof accessToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(10);
  });

  // ── Orders ────────────────────────────────────────────────────────────────

  test('TC_API_08 - POST /orders creates an order with valid token', async () => {
    const { status, body } = await apiHelper.createOrder({
      bookId: availableBookId,
      customerName: ApiData.clientName,
    });
    expect(status).toBe(201);
    expect(body).toHaveProperty('orderId');
    createdOrderId = body.orderId;
  });

  test('TC_API_09 - POST /orders without token returns 401', async ({ request }) => {
    const response = await request.post(`${ApiData.baseUrl}/orders`, {
      data: { bookId: availableBookId, customerName: 'Test User' },
    });
    expect(response.status()).toBe(401);
  });

  test('TC_API_10 - GET /orders returns list of orders', async () => {
    const { status, body } = await apiHelper.getAllOrders();
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('TC_API_11 - GET /orders/:id returns specific order', async () => {
    // Ensure order is created first
    const { body: order } = await apiHelper.createOrder({
      bookId: availableBookId,
      customerName: ApiData.clientName,
    });
    const orderId = order.orderId;

    const { status, body } = await apiHelper.getOrderById(orderId);
    expect(status).toBe(200);
    expect(body).toHaveProperty('id', orderId);
    expect(body.customerName).toBe(ApiData.clientName);
  });

  test('TC_API_12 - PATCH /orders/:id updates customer name', async () => {
    const { body: newOrder } = await apiHelper.createOrder({
      bookId: availableBookId,
      customerName: ApiData.clientName,
    });
    const orderId = newOrder.orderId;

    const updatedName = 'Updated Customer Name';
    const { status } = await apiHelper.updateOrder(orderId, { customerName: updatedName });
    expect(status).toBe(204);

    // Verify update
    const { body: updated } = await apiHelper.getOrderById(orderId);
    expect(updated.customerName).toBe(updatedName);
  });

  test('TC_API_13 - DELETE /orders/:id deletes the order', async () => {
    const { body: newOrder } = await apiHelper.createOrder({
      bookId: availableBookId,
      customerName: ApiData.clientName,
    });
    const orderId = newOrder.orderId;

    const { status } = await apiHelper.deleteOrder(orderId);
    expect(status).toBe(204);

    // Verify deletion
    const { status: getStatus } = await apiHelper.getOrderById(orderId);
    expect(getStatus).toBe(404);
  });

  test('TC_API_14 - DELETE /orders/:id without token returns 401', async ({ request }) => {
    const response = await request.delete(`${ApiData.baseUrl}/orders/fake-id`);
    expect(response.status()).toBe(401);
  });


});

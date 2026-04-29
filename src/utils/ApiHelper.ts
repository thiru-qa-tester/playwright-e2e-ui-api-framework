import { APIRequestContext } from '@playwright/test';

export interface ApiClientOptions {
  accessToken?: string;
}

export interface OrderPayload {
  bookId: number;
  customerName: string;
}

export interface PatchOrderPayload {
  customerName?: string;
}

export class ApiHelper {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;
  private accessToken: string = '';

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async registerClient(clientName: string, clientEmail: string): Promise<string> {
    const response = await this.request.post(`${this.baseUrl}/api-clients`, {
      data: { clientName, clientEmail },
    });
    const body = await response.json();
    this.accessToken = body.accessToken;
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  private getAuthHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  // ── Books ─────────────────────────────────────────────────────────────────

  async getAllBooks(type?: 'fiction' | 'non-fiction') {
    const url = type
      ? `${this.baseUrl}/books?type=${type}`
      : `${this.baseUrl}/books`;
    const response = await this.request.get(url);
    return { status: response.status(), body: await response.json() };
  }

  async getBookById(bookId: number) {
    const response = await this.request.get(`${this.baseUrl}/books/${bookId}`);
    return { status: response.status(), body: await response.json() };
  }

  // ── Orders ────────────────────────────────────────────────────────────────

  async createOrder(payload: OrderPayload) {
    const response = await this.request.post(`${this.baseUrl}/orders`, {
      data: payload,
      headers: this.getAuthHeaders(),
    });
    return { status: response.status(), body: await response.json() };
  }

  async getAllOrders() {
    const response = await this.request.get(`${this.baseUrl}/orders`, {
      headers: this.getAuthHeaders(),
    });
    return { status: response.status(), body: await response.json() };
  }

  async getOrderById(orderId: string) {
    const response = await this.request.get(`${this.baseUrl}/orders/${orderId}`, {
      headers: this.getAuthHeaders(),
    });
    return { status: response.status(), body: await response.json() };
  }

  async updateOrder(orderId: string, payload: PatchOrderPayload) {
    const response = await this.request.patch(`${this.baseUrl}/orders/${orderId}`, {
      data: payload,
      headers: this.getAuthHeaders(),
    });
    return { status: response.status() };
  }

  async deleteOrder(orderId: string) {
    const response = await this.request.delete(`${this.baseUrl}/orders/${orderId}`, {
      headers: this.getAuthHeaders(),
    });
    return { status: response.status() };
  }

  // ── Status ────────────────────────────────────────────────────────────────

  async getApiStatus() {
    const response = await this.request.get(`${this.baseUrl}/status`);
    return { status: response.status(), body: await response.json() };
  }
}

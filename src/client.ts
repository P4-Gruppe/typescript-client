import type { Schema, Query, QueryResult, SchemaResponse } from './types';

export class RedtypeClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://sg4os4okwcs00s8sowww0wco.138.2.151.42.sslip.io') {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(error)}`);
    }
    return response.json();
  }

  async defineSchema(schema: Schema): Promise<SchemaResponse> {
    const response = await fetch(`${this.baseUrl}/schema`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schema),
    });
    return this.handleResponse<SchemaResponse>(response);
  }

  async query<T>(query: Query): Promise<QueryResult<T>> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });
    return this.handleResponse<QueryResult<T>>(response);
  }

  async insert<T>(schema: string, data: T): Promise<T> {
    const response = await fetch(`${this.baseUrl}/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schema, data }),
    });
    return this.handleResponse<T>(response);
  }
} 
import type { Schema, Query, QueryResult, SchemaResponse, SchemaValidationRequest, SchemaValidationResponse } from './types';
import { hashSchema } from './utils/schemaHash';

export class RedtypeClient {
  private baseUrl: string;
  private schemaValidated: boolean = false;

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

  /**
   * Defines a schema on the server. This should only be called by the configuration script,
   * not by the regular client application.
   */
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

  /**
   * Validates that the client's schema matches the server's schema by comparing hashes.
   * This should be called before making any other requests to ensure schema compatibility.
   */
  async validateSchema(schema: Schema): Promise<boolean> {
    if (this.schemaValidated) {
      return true; // Already validated
    }

    const hash = hashSchema(schema);
    const validationRequest: SchemaValidationRequest = {
      schemaName: schema.name,
      hash: hash,
    };

    try {
      const response = await fetch(`${this.baseUrl}/validate-schema`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationRequest),
      });

      const validationResponse = await this.handleResponse<SchemaValidationResponse>(response);
      this.schemaValidated = validationResponse.valid;

      if (!this.schemaValidated) {
        console.error(`Schema validation failed: ${validationResponse.message}`);
      }

      return this.schemaValidated;
    } catch (error) {
      console.error('Schema validation error:', error);
      return false;
    }
  }

  async query<T>(query: Query): Promise<QueryResult<T>> {
    if (!this.schemaValidated) {
      throw new Error('Schema not validated. Call validateSchema() before making queries.');
    }

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
    if (!this.schemaValidated) {
      throw new Error('Schema not validated. Call validateSchema() before inserting data.');
    }

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
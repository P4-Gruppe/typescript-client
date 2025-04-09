import type { Schema, Query, QueryResult, SchemaResponse, SchemaValidationRequest, SchemaValidationResponse } from './types';
import { hashSchema } from './utils/schemaHash';

export class RedtypeClient {
  private baseUrl: string;
  private schemaValidated: boolean = false;

  constructor(baseUrl: string = 'localhost:3000') {
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
   *
   * Note: This method has two modes of operation:
   * 1. If the server has the /validate-schema endpoint, it will use hash validation
   * 2. If the server doesn't have the endpoint yet, it will fall back to sending the full schema
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
      // First try the hash validation endpoint
      try {
        const response = await fetch(`${this.baseUrl}/validate-schema`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validationRequest),
        });

        if (response.ok) {
          const validationResponse = await response.json() as SchemaValidationResponse;
          this.schemaValidated = validationResponse.valid;

          if (!this.schemaValidated) {
            console.error(`Schema validation failed: ${validationResponse.message}. Please run the configuration script.`);
          }

          return this.schemaValidated;
        }
        // If we get a 404, the endpoint doesn't exist yet, so we'll fall back to the old method
      } catch {
        console.warn('Schema validation endpoint not available, falling back to schema definition');
        // Fall through to the fallback method
      }

      // Fallback: Define the schema directly (old method)
      console.log('Falling back to full schema definition...');
      const schemaResponse = await this.defineSchema(schema);
      this.schemaValidated = schemaResponse.success;

      if (!this.schemaValidated) {
        console.error('Schema definition failed');
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
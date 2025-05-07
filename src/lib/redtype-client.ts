import axios, { AxiosError } from 'axios';

// Define response types
interface SchemaResponse {
    schema: string;
}

interface CommandResponse {
    result: unknown;
}

interface QueryResponse {
    results: unknown;
}

interface DbStatsResponse {
    stats: {
        collections: number;
        documents: number;
        size: number;
    };
}

export class RedTypeClient {
    private baseUrl: string;

    constructor(baseUrl: string = '/api/redtype') {
        this.baseUrl = baseUrl;
    }

    // Set the database schema
    async setSchema(schema: string): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/setSchema`, schema);
        } catch (error) {
            if (error instanceof AxiosError && error.message.includes('CORS')) {
                console.error('CORS error: The server is not configured to allow cross-origin requests');
            } else {
                console.error('Failed to set schema:', error);
            }
            throw error;
        }
    }

    // Get the current schema
    async getSchema(): Promise<string> {
        try {
            const response = await axios.get<SchemaResponse>(`${this.baseUrl}/getSchema`);
            return response.data.schema;
        } catch (error) {
            if (error instanceof AxiosError && error.message.includes('CORS')) {
                console.error('CORS error: The server is not configured to allow cross-origin requests');
            } else {
                console.error('Failed to get schema:', error);
            }
            throw error;
        }
    }

    // Execute a command
    async executeCommand(command: string): Promise<CommandResponse> {
        try {
            const response = await axios.post<CommandResponse>(`${this.baseUrl}/command`, command);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.message.includes('CORS')) {
                console.error('CORS error: The server is not configured to allow cross-origin requests');
            } else {
                console.error('Failed to execute command:', error);
            }
            throw error;
        }
    }

    // Execute a query
    async executeQuery(query: string): Promise<QueryResponse> {
        try {
            const response = await axios.post<QueryResponse>(`${this.baseUrl}/`, query);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.message.includes('CORS')) {
                console.error('CORS error: The server is not configured to allow cross-origin requests');
            } else {
                console.error('Failed to execute query:', error);
            }
            throw error;
        }
    }

    // Get database statistics
    async getDbStats(): Promise<DbStatsResponse> {
        try {
            const response = await axios.get<DbStatsResponse>(`${this.baseUrl}/dbStats`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.message.includes('CORS')) {
                console.error('CORS error: The server is not configured to allow cross-origin requests');
            } else {
                console.error('Failed to get database stats:', error);
            }
            throw error;
        }
    }
} 
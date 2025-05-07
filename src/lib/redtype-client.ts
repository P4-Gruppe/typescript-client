import axios from 'axios';

export class RedTypeClient {
    private baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:1337') {
        this.baseUrl = baseUrl;
    }

    // Set the database schema
    async setSchema(schema: string): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/setSchema`, schema);
        } catch (error) {
            console.error('Failed to set schema:', error);
            throw error;
        }
    }

    // Get the current schema
    async getSchema(): Promise<string> {
        try {
            const response = await axios.get(`${this.baseUrl}/getSchema`);
            return response.data.schema;
        } catch (error) {
            console.error('Failed to get schema:', error);
            throw error;
        }
    }

    // Execute a command
    async executeCommand(command: string): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/command`, command);
            return response.data;
        } catch (error) {
            console.error('Failed to execute command:', error);
            throw error;
        }
    }

    // Execute a query
    async executeQuery(query: string): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/`, query);
            return response.data;
        } catch (error) {
            console.error('Failed to execute query:', error);
            throw error;
        }
    }

    // Get database statistics
    async getDbStats(): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/dbStats`);
            return response.data;
        } catch (error) {
            console.error('Failed to get database stats:', error);
            throw error;
        }
    }
} 
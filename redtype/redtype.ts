export class RedtypeClient {
    private endpoint: string;
    private schemaEndpoint: string;
    private commandEndpoint: string;

    constructor(endpoint: string, schemaPath: string = '/schema', commandPath: string = '/command') {
        this.endpoint = endpoint;
        this.schemaEndpoint = new URL(schemaPath, endpoint).toString();
        this.commandEndpoint = new URL(commandPath, endpoint).toString();
    }

    async runCommand(command: string): Promise<unknown> {
        try {
            const response = await fetch(this.commandEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: command,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Failed to run command:", error);
            throw error;
        }
    }

    async applySchema(schema: string): Promise<unknown> {
        try {
            const response = await fetch(this.schemaEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: schema,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Failed to apply schema:", error);
            throw error;
        }
    }

    async runQuery(query: string): Promise<unknown> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: query,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            return await response.text();
        } catch (error) {
            console.error("Failed to run query:", error);
            throw error;
        }
    }
}
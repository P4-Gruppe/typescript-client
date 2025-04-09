# Schema Configuration Guide

This document explains how to use the new schema configuration system.

## Overview

The schema configuration system has been updated to work as follows:

1. A separate configuration script is used to manually set up the schema on the server
2. The schema is hashed for validation purposes
3. When the client starts, it sends only the hash to validate that the client and server schemas match

This approach ensures that:
- The schema is only sent to the server when explicitly configured
- The client and server schemas are always in sync
- The client can validate schema compatibility without sending the full schema each time

## Configuration Steps

### 1. Define Your Schema

Define your schema in `src/redTypeConfig.ts`:

```typescript
import type { Schema } from './types';

export const userSchema: Schema = {
  name: 'users',
  fields: [
    { name: 'id', type: 'number', required: true, unique: true },
    { name: 'name', type: 'string', required: true },
    // ... other fields
  ],
};
```

### 2. Run the Configuration Script

When you need to set up or update the schema on the server, run the configuration script:

```bash
bun run src/configureSchema.ts
```

This will:
- Send the full schema to the server
- Calculate and display the schema hash
- The server will store both the schema and its hash

### 3. Client Usage

In your client application, use the schema validation approach:

```typescript
import { RedtypeClient } from './client';
import { userSchema } from './redTypeConfig';

async function main() {
  const client = new RedtypeClient();

  try {
    // Validate the schema against the server
    const isValid = await client.validateSchema(userSchema);
    
    if (!isValid) {
      console.error('Schema validation failed. Please run the configuration script first.');
      return;
    }
    
    // Now you can use the client to query and insert data
    const results = await client.query({ /* ... */ });
    // ...
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Important Notes

- Always run the configuration script when you change the schema
- The client will automatically validate the schema before allowing queries or inserts
- If schema validation fails, you need to run the configuration script to update the server

## Server Implementation

For the server-side implementation details, see the `server-implementation-notes.md` file.

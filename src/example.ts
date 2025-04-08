import { RedtypeClient } from './client';
import type { Schema, Query } from './types';

async function main() {
  const client = new RedtypeClient();

  try {
    // Define a schema for a User
    const userSchema: Schema = {
      name: 'users',
      fields: [
        { name: 'id', type: 'number', required: true, unique: true },
        { name: 'name', type: 'string', required: true },
        { name: 'email', type: 'string', required: true, unique: true },
        { name: 'age', type: 'number' },
        { name: 'isActive', type: 'boolean' },
        { name: 'createdAt', type: 'date' },
      ],
    };

    // Create the schema
    console.log('Creating schema...');
    const schemaResponse = await client.defineSchema(userSchema);
    console.log('Schema response:', schemaResponse);

    // Insert a user
    console.log('Inserting user...');
    const user = await client.insert('users', {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      isActive: true,
      createdAt: new Date().toISOString(), // Convert Date to ISO string
    });
    console.log('Inserted user:', user);

    // Query users
    console.log('Querying users...');
    const query: Query = {
      schema: 'users',
      where: [
        { field: 'age', operator: 'gte', value: 25 },
        { field: 'isActive', operator: 'eq', value: true },
      ],
      select: ['name', 'email', 'age'],
      limit: 10,
    };

    const results = await client.query(query);
    console.log('Query results:', results);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error); 
import { RedtypeClient } from './client';
import type { Query } from './types';
import { userSchema } from './redTypeConfig';

async function main() {
  const client = new RedtypeClient();

  try {
    // Validate the schema against the server
    console.log('Validating schema...');
    const isValid = await client.validateSchema(userSchema);

    if (!isValid) {
      console.error('Schema validation failed. Please run the configuration script first.');
      return;
    }

    console.log('Schema validation successful.');

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
        { field: 'age', operator: '>=', value: 25 },
        { field: 'isActive', operator: '==', value: true },
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
import { RedtypeClient } from './client';
import { userSchema } from './redTypeConfig';
import { hashSchema } from './utils/schemaHash';

/**
 * This script is used to manually configure the schema on the server.
 * It should be run separately from the main application.
 */
async function configureSchema() {
  console.log('Starting schema configuration...');
  const client = new RedtypeClient();

  try {
    // Send the full schema to the server
    console.log('Sending schema to server...');
    const schemaResponse = await client.defineSchema(userSchema);
    console.log('Schema response:', schemaResponse);

    // Calculate and display the schema hash for reference
    const hash = hashSchema(userSchema);
    console.log('Schema hash:', hash);
    console.log('Schema configuration complete. Use this hash for client validation.');
  } catch (error) {
    console.error('Error configuring schema:', error);
  }
}

// Run the configuration
configureSchema().catch(console.error);

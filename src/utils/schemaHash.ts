import { SHA256 } from 'crypto-js';
import type { Schema } from '../types';

/**
 * Generates a hash of the schema to use for validation
 * @param schema The schema to hash
 * @returns A SHA-256 hash of the schema as a string
 */
export function hashSchema(schema: Schema): string {
  // Sort the fields to ensure consistent hashing regardless of field order
  const sortedFields = [...schema.fields].sort((a, b) => a.name.localeCompare(b.name));
  
  // Create a normalized schema for hashing
  const normalizedSchema = {
    name: schema.name,
    fields: sortedFields.map(field => ({
      name: field.name,
      type: field.type,
      required: field.required || false,
      unique: field.unique || false,
    })),
  };
  
  // Convert to string and hash
  const schemaString = JSON.stringify(normalizedSchema);
  return SHA256(schemaString).toString();
}

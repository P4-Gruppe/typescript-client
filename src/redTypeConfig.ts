import type { Schema } from './types';

export const userSchema: Schema = {
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

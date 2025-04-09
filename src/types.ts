// Schema Types
export type DataType = 'string' | 'number' | 'boolean' | 'date';

export interface Field {
  name: string;
  type: DataType;
  required?: boolean;
  unique?: boolean;
}

export interface Schema {
  name: string;
  fields: Field[];
}

// Query Types
export type Operator = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'contains';

export interface QueryCondition {
  field: string;
  operator: Operator;
  value: string | number | boolean | Date;
}

export interface Query {
  schema: string;
  where?: QueryCondition[];
  select?: string[];
  limit?: number;
  offset?: number;
}

// Response Types
export interface QueryResult<T> {
  data: T[];
  count: number;
}

export interface SchemaResponse {
  success: boolean;
  message: string;
} 
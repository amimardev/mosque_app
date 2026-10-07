import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL must be configured with a Neon/PostgreSQL connection string. Local databases are not supported.'
  );
}

if (!/^postgres(?:ql)?:\/\//i.test(connectionString)) {
  throw new Error(
    'DATABASE_URL must use a PostgreSQL connection string (postgres:// or postgresql://). Local databases are not supported.'
  );
}

export const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

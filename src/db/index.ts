import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const meta = import.meta as any;
const connectionString =
  meta?.env?.VITE_DATABASE_URL ||
  (typeof process !== 'undefined' ? process.env.DATABASE_URL : undefined) ||
  'postgresql://neondb_owner:npg_KJRtis19vLYf@ep-snowy-hill-b49jwogo-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

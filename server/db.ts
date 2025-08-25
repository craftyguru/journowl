import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set for Supabase connection');
}

console.log(`Database connecting to: ${process.env.DATABASE_URL}`);

// Supabase PostgreSQL connection - direct connection format
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  max: 10,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

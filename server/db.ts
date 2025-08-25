import pg from "pg";
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set for Supabase connection');
}

console.log(`Database connecting to: Supabase database`);

// Supabase PostgreSQL connection with proper SSL configuration
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true, rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 30000,
  query_timeout: 30000,
  application_name: 'journowl-app',
});

export const db = drizzle(pool, { schema });

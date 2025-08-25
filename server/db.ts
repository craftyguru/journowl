import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set for Supabase connection');
}

console.log(`Database connecting to: Supabase database`);

// Supabase PostgreSQL connection with optimized settings
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // Reduced for Supabase limits
  idleTimeoutMillis: 20000, // Shorter timeout
  connectionTimeoutMillis: 5000, // Faster timeout
  statement_timeout: 30000, // 30s statement timeout
  query_timeout: 30000, // 30s query timeout
  application_name: 'journowl-app', // For better connection tracking
});

export const db = drizzle(pool, { schema });

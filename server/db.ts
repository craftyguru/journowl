import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// Use ONLY Supabase (DATABASE_URL)
// Replit native DB is no longer used
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is required. Set your Supabase connection string in environment variables.',
  );
}

let connectionString = process.env.DATABASE_URL;
if (connectionString.includes('?sslmode=')) {
  connectionString = connectionString.replace(/\?sslmode=\w+/, '');
}

const connectionConfig = {
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

console.log('✅ Using Supabase (DATABASE_URL) - Replit native DB disabled');

export const pool = new Pool(connectionConfig);
export const db = drizzle(pool, { schema });

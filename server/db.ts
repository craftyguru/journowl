import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// Build connection config from environment variables
// Prefer individual credentials (Replit native DB) over DATABASE_URL (Supabase)
let connectionConfig: any;

if (process.env.PGHOST && process.env.PGPORT && process.env.PGUSER && process.env.PGDATABASE) {
  // Use Replit native database configuration
  connectionConfig = {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE,
    ssl: false, // Replit native DB doesn't require SSL
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
  console.log('Using Replit native database:', process.env.PGHOST);
} else if (process.env.DATABASE_URL) {
  // Fallback to DATABASE_URL (Supabase or other)
  let connectionString = process.env.DATABASE_URL;
  if (connectionString.includes('?sslmode=')) {
    connectionString = connectionString.replace(/\?sslmode=\w+/, '');
  }
  connectionConfig = {
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
  console.log('Using DATABASE_URL connection');
} else {
  throw new Error(
    'Database configuration is missing. Ensure DATABASE_URL or PGHOST/PGPORT/PGUSER/PGDATABASE are set.',
  );
}

export const pool = new Pool(connectionConfig);
export const db = drizzle(pool, { schema });

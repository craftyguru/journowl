import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// Force use of Replit database - ignore Supabase for now
const useSupabase = false;

let connectionString: string;

// Check if DATABASE_URL contains Supabase - if so, ignore it and use Replit fallback
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co')) {
  console.log('⚠️  Ignoring Supabase DATABASE_URL - using Replit database instead');
  connectionString = 'postgresql://neondb_owner:npg_mLfKSr47yZGf@ep-square-waterfall-af0ahqiu.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';
} else if (process.env.DATABASE_URL) {
  connectionString = process.env.DATABASE_URL;
} else {
  // Fallback to known working Replit database
  connectionString = 'postgresql://neondb_owner:npg_mLfKSr47yZGf@ep-square-waterfall-af0ahqiu.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require';
}

console.log(`Database connecting to: ${connectionString.includes('supabase.co') ? 'Supabase' : 'Replit'} database`);

// PostgreSQL connection with SSL enabled
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

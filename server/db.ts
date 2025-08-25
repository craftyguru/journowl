import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

// Log what the app is actually using (sanitized)
try {
  const u = new URL(process.env.DATABASE_URL!);
  console.log("DB host in use:", u.hostname, "port:", u.port, "db:", u.pathname);
} catch (e) {
  console.log("DATABASE_URL parse error:", e);
}

// Supabase connection with proper settings
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

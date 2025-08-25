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

// Supabase pooler connection with SASL authentication fix
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Pooler-specific settings to avoid SASL issues
  statement_timeout: 30000,
  query_timeout: 30000,
  max: 5, // Lower max connections for pooler
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 15000,
});

export const db = drizzle(pool, { schema });

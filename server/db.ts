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

// Parse DATABASE_URL to fix authentication issues
const databaseUrl = process.env.DATABASE_URL!;
const parsedUrl = new URL(databaseUrl);

// Supabase pooler connection with authentication bypass
export const pool = new Pool({
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port),
  database: parsedUrl.pathname.slice(1),
  user: parsedUrl.username,
  password: decodeURIComponent(parsedUrl.password || ''),
  ssl: {
    rejectUnauthorized: false,
  },
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

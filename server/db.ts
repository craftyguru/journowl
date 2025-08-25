import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

// Bypass SSL certificate validation for Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

// Debug: show exactly what host/port/path we’re using (no password)
try {
  const u = new URL(DATABASE_URL);
  console.log("DB host in use:", u.hostname, "port:", u.port || "(default)", "db:", u.pathname);
} catch (e) {
  console.error("DATABASE_URL parse error:", e);
  throw e;
}

// IMPORTANT: use the connection string directly
export const pool = new Pool({
  connectionString: DATABASE_URL,          // includes ?sslmode=require&pgbouncer=true&connection_limit=1
  max: 3,                                  // session pooler friendly
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

// Optional: quick health check at startup
await pool.query("SELECT NOW()");          // will throw if password/host is wrong

export const db = drizzle(pool, { schema });

import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const cs = process.env.DATABASE_URL!;
const u = new URL(cs);
console.log("DB host in use:", u.hostname, "port:", u.port || "(default)", "db:", u.pathname);

export const pool = new Pool({
  connectionString: cs,
  ssl: { rejectUnauthorized: true }, // keep strict; Supabase uses valid certs
  max: 3,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

await pool.query("select now()"); // fail fast if anything's wrong
export const db = drizzle(pool, { schema });
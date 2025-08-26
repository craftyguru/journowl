// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

const connectionString = process.env.DATABASE_URL!; // keep sslmode=require & options=project=...

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },   // ✅ REQUIRED for Supabase pooler
});

export const db = drizzle(pool, { schema });
// (optionally) export pool if you need raw queries: export { pool };

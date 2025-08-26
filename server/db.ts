import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

const connectionString = process.env.DATABASE_URL!;

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },   // required for Supabase pooler
});

export const db = drizzle(pool, { schema });

// optional health check
pool.query("SELECT 1").then(() => console.log("✅ DB OK"))
  .catch(e => console.error("DB FAIL", e));

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.asjcxaiabjsbjbasssfe:zjJ1W0PFFISI2SK7@aws-0-us-east-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

// optional health check
pool.query("SELECT 1").then(() => console.log("✅ DB OK"))
  .catch(e => console.error("DB FAIL", e));

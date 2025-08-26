import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

export const pool = new Pool({
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.asjcxaiabjsbjbasssfe',
  password: 'zjJ1W0PFFISI2SK7',
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

// optional health check
pool.query("SELECT 1").then(() => console.log("✅ DB OK"))
  .catch(e => console.error("DB FAIL", e));

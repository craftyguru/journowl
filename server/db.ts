import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

// Strip SSL requirement from connection string and disable SSL entirely
const connectionString = process.env.DATABASE_URL!.replace('?sslmode=require', '');

const pool = new Pool({
  connectionString,
  ssl: false
});

export const db = drizzle(pool, { schema });
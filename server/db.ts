import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const cs = process.env.DATABASE_URL!;
const u = new URL(cs);
console.log("DB host in use:", u.hostname, "port:", u.port || "(default)", "db:", u.pathname);

// Parse the connection string manually to handle SSL properly
const url = new URL(cs);
export const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port || '5432'),
  database: url.pathname.substring(1),
  user: url.username,
  password: url.password,
  ssl: false, // Try without SSL first
  max: 3,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

// Remove startup health check - test connection on first API call instead
export const db = drizzle(pool, { schema });
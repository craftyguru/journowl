import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const cs = process.env.DATABASE_URL!;
const u = new URL(cs);
console.log("DB host in use:", u.hostname, "port:", u.port || "(default)", "db:", u.pathname);

// Test without SSL first to see if credentials work
export const pool = new Pool({
  host: u.hostname,
  port: parseInt(u.port || '5432'),
  database: u.pathname.substring(1),
  user: u.username,
  password: u.password,
  ssl: false, // completely disable SSL for testing
  max: 3,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

// Remove startup health check - test connection on first API call instead
export const db = drizzle(pool, { schema });
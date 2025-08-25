import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

// resolve path relative to this file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const caPath = process.env.SSL_CA_PATH || path.join(__dirname, "certs", "prod-ca-2021.crt");
const ca = readFileSync(caPath, "utf8");

const cs = process.env.DATABASE_URL!;
const u = new URL(cs);
console.log("DB host in use:", u.hostname, "port:", u.port || "(default)", "db:", u.pathname);

export const pool = new Pool({
  connectionString: cs,                 // keep ?sslmode=require in the URL
  ssl: { ca, rejectUnauthorized: true }, // trust Supabase CA and verify
  max: 3,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

// Remove startup health check - test connection on first API call instead
export const db = drizzle(pool, { schema });
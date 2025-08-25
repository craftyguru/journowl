import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";
import fs from "fs";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(path.join(process.cwd(), 'server/certs/prod-ca-2021.crt')).toString()
  }
});

export const db = drizzle(pool, { schema });
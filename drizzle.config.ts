import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
 dbCredentials: {
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.asjcxaiabjsbjbasssfe',
  password: 'zjJ1W0PFFISI2SK7',
  ssl: { mode: 'require' },
},
});
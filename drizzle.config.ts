import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

const requiredDbEnv = ["DB_HOST", "DB_USERNAME", "DB_DATABASE"] as const;

for (const key of requiredDbEnv) {
  if (!process.env[key]) {
    throw new Error(`${key} is required for the MySQL connection.`);
  }
}

const dbHost = process.env.DB_HOST!;
const dbUser = process.env.DB_USERNAME!;
const dbName = process.env.DB_DATABASE!;

export default defineConfig({
  schema: './db/schema/schema.ts',
  out: './db/migrations',
  dialect: "mysql",

  // driver: "pglite",
  dbCredentials: {
    host: dbHost,
    port: Number(process.env.DB_PORT || 3306),
    user: dbUser,
    password: process.env.DB_PASSWORD ?? "",
    database: dbName,
  },
  verbose: true,
  strict: true,
});

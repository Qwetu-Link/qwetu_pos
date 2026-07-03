import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './db/schema/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',

  // driver: "pglite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

console.log(process.env.DATABASE_URL)

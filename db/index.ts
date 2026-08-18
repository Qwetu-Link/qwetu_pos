import { config } from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

config({ path: ".env.local" });

const globalForDb = globalThis as typeof globalThis & {
  qwetuMysqlPool?: mysql.Pool;
};

const pool =
  globalForDb.qwetuMysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: Number(
      process.env.DATABASE_POOL_MAX ?? 5
    ),

    idleTimeout: 20_000,
    connectTimeout: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.qwetuMysqlPool = pool;
}

export const db = drizzle({
  client: pool,
});

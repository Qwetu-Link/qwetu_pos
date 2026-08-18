import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
}

const globalForDb = globalThis as typeof globalThis & {
    qwetuPostgresClient?: postgres.Sql;
};

const client =
    globalForDb.qwetuPostgresClient ??
    postgres(connectionString, {
        prepare: false,
        max: Number(process.env.DATABASE_POOL_MAX ?? 5),
        idle_timeout: 20,
        connect_timeout: 10,
    });

if (process.env.NODE_ENV !== "production") {
    globalForDb.qwetuPostgresClient = client;
}

// export const db = drizzle(client);
export const db = drizzle({ client });

// import { config } from 'dotenv';
// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'

// config({ path: '.env' }); // or .env.local

// async function main() {
//     const client = postgres(process.env.DATABASE_URL!)
//     const db = drizzle({ client });
// }

// main();


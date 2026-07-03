import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env.local' }); // or .env.local

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
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


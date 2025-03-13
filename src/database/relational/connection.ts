import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(DATABASE_URL, { prepare: false });
const db = drizzle({ client });
export default db;

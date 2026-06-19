import "server-only";
import { Pool, type QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as { binhAnPool?: Pool };

function createPool() {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) throw new Error("SUPABASE_DB_URL is not configured.");

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5
  });
}

const pool = globalForDb.binhAnPool || createPool();
if (process.env.NODE_ENV !== "production") globalForDb.binhAnPool = pool;

export async function dbQuery<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return pool.query<T>(text, values);
}

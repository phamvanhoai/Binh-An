import { readFileSync } from "node:fs";
import { Client } from "pg";

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error("Missing SUPABASE_DB_URL.");
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

try {
  const sql = readFileSync("supabase/schema.sql", "utf8");
  await client.connect();
  await client.query(sql);

  const result = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in (
        'profiles',
        'daily_messages',
        'user_daily_messages',
        'prayers',
        'prayer_reactions',
        'future_letters',
        'memorials',
        'memorial_candles',
        'gratitude_entries',
        'reports'
      )
    order by table_name
  `);

  console.log(`Imported tables: ${result.rows.map((row) => row.table_name).join(", ")}`);
} finally {
  await client.end();
}

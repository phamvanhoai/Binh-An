import { Client } from "pg";

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error("Missing SUPABASE_DB_URL.");
  process.exit(1);
}

const messages = [
  {
    message: "Có những điều không cần vội vàng. Hôm nay, hãy cho bản thân được thở chậm lại một chút.",
    reflection: "Hôm nay bạn muốn buông bỏ điều gì?",
    category: "peace",
    activeDate: true
  },
  {
    message: "Bạn đã cố gắng nhiều hơn bạn nghĩ. Hãy dịu dàng với chính mình hôm nay.",
    reflection: "Điều nào trong bạn đang cần được công nhận?",
    category: "hope",
    activeDate: false
  },
  {
    message: "Không phải ngày nào cũng phải thật mạnh mẽ. Có ngày chỉ cần bình an là đủ.",
    reflection: "Bạn cần nghỉ ngơi ở đâu?",
    category: "peace",
    activeDate: false
  },
  {
    message: "Một ngày mới không cần hoàn hảo, chỉ cần có một điều tốt đẹp.",
    reflection: "Điều tốt đẹp nhỏ nào đang ở gần bạn?",
    category: "gratitude",
    activeDate: false
  }
];

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

try {
  await client.connect();
  await client.query("truncate table user_daily_messages cascade");
  await client.query("truncate table daily_messages cascade");

  for (const item of messages) {
    await client.query(
      `
        insert into daily_messages (message, reflection_question, category, active_date)
        values ($1, $2, $3, ${item.activeDate ? "current_date" : "null"})
      `,
      [item.message, item.reflection, item.category]
    );
  }

  const result = await client.query("select count(*)::int as count from daily_messages");
  console.log(`daily_messages updated: ${result.rows[0].count}`);
} finally {
  await client.end();
}

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function parseEnvFile(fileName) {
  const filePath = join(root, fileName);
  if (!existsSync(filePath)) return {};

  return Object.fromEntries(
    readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
        return [key, value];
      })
  );
}

const env = {
  ...parseEnvFile(".env"),
  ...parseEnvFile(".env.local"),
  ...process.env
};

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("\n[Bình An] Kiểm tra kết nối Supabase");

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("[Bình An] Supabase: chưa cấu hình .env.local");
  console.log("[Bình An] Hãy điền NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY để kết nối backend.\n");
  process.exit(0);
}

try {
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/settings`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    }
  });

  if (response.ok) {
    console.log("[Bình An] Supabase: kết nối OK\n");
  } else {
    console.log(`[Bình An] Supabase: đã cấu hình, nhưng kiểm tra trả về HTTP ${response.status}`);
    console.log("[Bình An] Kiểm tra lại URL, anon key và trạng thái Supabase project.\n");
  }
} catch (error) {
  console.log("[Bình An] Supabase: không thể kết nối");
  console.log(`[Bình An] Lý do: ${error instanceof Error ? error.message : "unknown error"}\n`);
}

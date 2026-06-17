import { getUserOrError } from "@/lib/auth";
import { demoPrayers } from "@/lib/demo-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { prayerSchema } from "@/lib/validations/prayer";
import { fail, ok } from "@/lib/utils";

export async function GET(request: Request) {
  if (!hasSupabaseEnv()) {
    return ok(demoPrayers);
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const supabase = await createClient();
  let query = supabase
    .from("prayers")
    .select("id, content, type, created_at")
    .eq("visibility", "public_anonymous")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(from, to);

  const type = searchParams.get("type");
  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) return fail(error.message, 500);
  return ok(data || []);
}

export async function POST(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = prayerSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("prayers")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data, { status: 201 });
}

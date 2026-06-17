import { getUserOrError } from "@/lib/auth";
import { gratitudeSchema } from "@/lib/validations/gratitude";
import { fail, ok } from "@/lib/utils";

export async function GET(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  let query = auth.supabase
    .from("gratitude_entries")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("entry_date", { ascending: false });

  const month = searchParams.get("month");
  const year = searchParams.get("year");
  if (month && year) {
    const start = `${year}-${month.padStart(2, "0")}-01`;
    const end = new Date(Number(year), Number(month), 0).toISOString().slice(0, 10);
    query = query.gte("entry_date", start).lte("entry_date", end);
  }

  const { data, error } = await query;
  if (error) return fail(error.message, 500);
  return ok(data || []);
}

export async function POST(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = gratitudeSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("gratitude_entries")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data, { status: 201 });
}

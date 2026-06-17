import { getUserOrError } from "@/lib/auth";
import { letterSchema } from "@/lib/validations/letter";
import { fail, ok } from "@/lib/utils";

export async function GET() {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("future_letters")
    .select("id, title, open_at, opened_at, created_at")
    .eq("user_id", auth.user.id)
    .order("open_at", { ascending: true });

  if (error) return fail(error.message, 500);
  return ok(data || []);
}

export async function POST(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = letterSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("future_letters")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data, { status: 201 });
}

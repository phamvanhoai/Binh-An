import { getUserOrError } from "@/lib/auth";
import { memorialSchema } from "@/lib/validations/memorial";
import { fail, ok } from "@/lib/utils";

export async function GET() {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("memorials")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) return fail(error.message, 500);
  return ok(data || []);
}

export async function POST(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = memorialSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("memorials")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data, { status: 201 });
}

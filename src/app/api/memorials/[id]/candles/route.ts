import { getUserOrError } from "@/lib/auth";
import { candleSchema } from "@/lib/validations/memorial";
import { fail, ok } from "@/lib/utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = candleSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("memorial_candles")
    .insert({ memorial_id: id, user_id: auth.user.id, message: parsed.data.message })
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data, { status: 201 });
}

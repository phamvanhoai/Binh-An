import { getUserOrError } from "@/lib/auth";
import { reactionSchema } from "@/lib/validations/prayer";
import { fail, ok } from "@/lib/utils";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = reactionSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("prayer_reactions")
    .upsert({ prayer_id: id, user_id: auth.user.id, reaction_type: parsed.data.reaction_type }, { onConflict: "prayer_id,user_id,reaction_type" })
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data, { status: 201 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = reactionSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { error } = await auth.supabase
    .from("prayer_reactions")
    .delete()
    .eq("prayer_id", id)
    .eq("user_id", auth.user.id)
    .eq("reaction_type", parsed.data.reaction_type);

  if (error) return fail(error.message, 500);
  return ok({ id, reaction_type: parsed.data.reaction_type });
}

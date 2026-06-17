import { getUserOrError } from "@/lib/auth";
import { gratitudePatchSchema } from "@/lib/validations/gratitude";
import { fail, ok } from "@/lib/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = gratitudePatchSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("gratitude_entries")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const { error } = await auth.supabase.from("gratitude_entries").delete().eq("id", id).eq("user_id", auth.user.id);
  if (error) return fail(error.message, 500);
  return ok({ id });
}

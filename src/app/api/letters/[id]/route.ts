import { getUserOrError } from "@/lib/auth";
import { fail, ok } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("future_letters")
    .select("*")
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) return fail(error.message, 500);
  if (!data) return fail("Letter not found.", 404);

  const isLocked = new Date(data.open_at).getTime() > Date.now();
  if (isLocked) {
    return ok({ id: data.id, title: data.title, is_locked: true, open_at: data.open_at });
  }

  if (!data.opened_at) {
    await auth.supabase.from("future_letters").update({ opened_at: new Date().toISOString() }).eq("id", data.id);
  }

  return ok({ ...data, is_locked: false });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const { error } = await auth.supabase.from("future_letters").delete().eq("id", id).eq("user_id", auth.user.id);
  if (error) return fail(error.message, 500);
  return ok({ id });
}

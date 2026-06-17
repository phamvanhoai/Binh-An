import { getUserOrError } from "@/lib/auth";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { memorialPatchSchema } from "@/lib/validations/memorial";
import { fail, ok } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasSupabaseEnv()) return fail("Supabase env is not configured.", 500);

  const supabase = await createClient();
  const { data, error } = await supabase.from("memorials").select("*").eq("id", id).maybeSingle();
  if (error) return fail(error.message, 500);
  if (!data) return fail("Memorial not found.", 404);
  return ok(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = memorialPatchSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("memorials")
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

  const { error } = await auth.supabase.from("memorials").delete().eq("id", id).eq("user_id", auth.user.id);
  if (error) return fail(error.message, 500);
  return ok({ id });
}

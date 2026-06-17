import { getUserOrError } from "@/lib/auth";
import { demoPrayers } from "@/lib/demo-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { prayerPatchSchema } from "@/lib/validations/prayer";
import { fail, ok } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasSupabaseEnv()) {
    return ok(demoPrayers.find((item) => item.id === id) || demoPrayers[0]);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("prayers").select("*").eq("id", id).maybeSingle();
  if (error) return fail(error.message, 500);
  if (!data) return fail("Prayer not found.", 404);

  const { data: reactions } = await supabase.from("prayer_reactions").select("reaction_type").eq("prayer_id", id);
  const counts = { pray: 0, peace: 0, candle: 0 };
  reactions?.forEach((reaction) => {
    counts[reaction.reaction_type as keyof typeof counts] += 1;
  });

  return ok({ ...data, counts });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = prayerPatchSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("prayers")
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

  const { error } = await auth.supabase.from("prayers").update({ status: "deleted" }).eq("id", id).eq("user_id", auth.user.id);
  if (error) return fail(error.message, 500);
  return ok({ id });
}

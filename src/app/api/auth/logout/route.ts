import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/utils";

export async function POST() {
  if (!hasSupabaseEnv()) return fail("Supabase env is not configured.", 500);

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return fail(error.message, 500);
  return ok({ signed_out: true });
}

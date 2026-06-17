import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/utils";

export async function GET() {
  if (!hasSupabaseEnv()) return fail("Supabase env is not configured.", 500);

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) return fail("Authentication required.", 401);
  return ok(user);
}

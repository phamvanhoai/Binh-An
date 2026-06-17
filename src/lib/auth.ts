import { fail } from "@/lib/utils";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export async function getUserOrError() {
  if (!hasSupabaseEnv()) {
    return { response: fail("Supabase env is not configured.", 500) };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { response: fail("Authentication required.", 401) };
  }

  return { supabase, user };
}

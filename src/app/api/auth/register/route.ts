import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/utils";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) return fail("Supabase env is not configured.", 500);

  const parsed = authSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) return fail(error.message, 400);
  return ok(data, { status: 201 });
}

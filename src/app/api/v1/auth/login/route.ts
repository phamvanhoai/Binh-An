import { z } from "zod";
import { apiError, apiOptions, apiResponse, createAppClient } from "@/lib/api-v1";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Email or password is invalid.", 422, parsed.error.flatten());
  }

  const supabase = createAppClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.session) {
    return apiError("AUTH_LOGIN_FAILED", error?.message || "Unable to create session.", 401);
  }

  return apiResponse({
    user: data.user,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      token_type: data.session.token_type
    }
  });
}

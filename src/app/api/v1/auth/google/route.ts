import { z } from "zod";
import { apiError, apiOptions, apiResponse, createAppClient } from "@/lib/api-v1";
import { getSiteSettings } from "@/lib/site-settings";

const schema = z.object({
  id_token: z.string().min(1),
  access_token: z.string().min(1).optional()
});

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const settings = await getSiteSettings();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Google ID token is required.", 422);
  }

  const supabase = createAppClient();
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: parsed.data.id_token,
    access_token: parsed.data.access_token
  });
  if (error || !data.session) {
    return apiError("GOOGLE_LOGIN_FAILED", error?.message || "Unable to create session.", 401);
  }

  const createdRecently =
    Date.now() - new Date(data.user.created_at).getTime() < 60_000;
  if (createdRecently && !settings.allowRegistration) {
    await supabase.auth.signOut();
    return apiError("REGISTRATION_DISABLED", "Registration is currently disabled.", 403);
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

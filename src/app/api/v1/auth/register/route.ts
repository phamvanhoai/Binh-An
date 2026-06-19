import { z } from "zod";
import { apiError, apiOptions, apiResponse, createAppClient } from "@/lib/api-v1";
import { getSiteSettings } from "@/lib/site-settings";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  display_name: z.string().trim().min(2).max(80).optional()
});

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const settings = await getSiteSettings();
  if (!settings.allowRegistration) {
    return apiError("REGISTRATION_DISABLED", "Registration is currently disabled.", 403);
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid registration data.", 422, parsed.error.flatten());
  }

  const supabase = createAppClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.display_name || "" }
    }
  });

  if (error) return apiError("AUTH_REGISTER_FAILED", error.message, 400);

  if (data.session && parsed.data.display_name) {
    const authenticatedClient = createAppClient(data.session.access_token);
    await authenticatedClient.from("profiles").upsert({
      id: data.user?.id || "",
      display_name: parsed.data.display_name
    });
  }

  return apiResponse(
    {
      user: data.user,
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
            token_type: data.session.token_type
          }
        : null,
      email_confirmation_required: !data.session
    },
    { status: 201 }
  );
}

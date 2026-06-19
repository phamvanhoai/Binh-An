import { z } from "zod";
import { apiError, apiOptions, apiResponse, createAppClient } from "@/lib/api-v1";

const schema = z.object({ refresh_token: z.string().min(1) });

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("REFRESH_TOKEN_MISSING", "Refresh token is required.", 422);
  }

  const supabase = createAppClient();
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: parsed.data.refresh_token
  });
  if (error || !data.session) {
    return apiError("REFRESH_TOKEN_INVALID", error?.message || "Unable to refresh session.", 401);
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

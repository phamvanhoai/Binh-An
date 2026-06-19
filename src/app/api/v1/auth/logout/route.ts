import { z } from "zod";
import {
  apiError,
  apiOptions,
  apiResponse,
  createAppClient,
  requireAppAuth
} from "@/lib/api-v1";

const schema = z.object({ refresh_token: z.string().min(1) });

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("REFRESH_TOKEN_MISSING", "Refresh token is required.", 422);
  }

  const supabase = createAppClient();
  const { error } = await supabase.auth.setSession({
    access_token: auth.token,
    refresh_token: parsed.data.refresh_token
  });
  if (error) return apiError("AUTH_LOGOUT_FAILED", error.message, 400);

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) return apiError("AUTH_LOGOUT_FAILED", signOutError.message, 400);
  return apiResponse({ signed_out: true });
}

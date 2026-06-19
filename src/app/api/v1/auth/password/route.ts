import { z } from "zod";
import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";

const schema = z.object({ password: z.string().min(8).max(128) });

export function OPTIONS() {
  return apiOptions();
}

export async function PATCH(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Password must contain at least 8 characters.", 422);
  }

  const { error } = await auth.supabase.auth.updateUser({
    password: parsed.data.password
  });
  if (error) return apiError("PASSWORD_UPDATE_FAILED", error.message, 400);
  return apiResponse({ updated: true });
}

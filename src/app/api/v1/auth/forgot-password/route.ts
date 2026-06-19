import { z } from "zod";
import { apiError, apiOptions, apiResponse, createAppClient } from "@/lib/api-v1";

const schema = z.object({
  email: z.string().email(),
  redirect_to: z.string().url().optional()
});

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "A valid email is required.", 422);
  }

  const supabase = createAppClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo:
      parsed.data.redirect_to ||
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`
  });
  if (error) return apiError("PASSWORD_RESET_FAILED", error.message, 400);

  return apiResponse({ sent: true });
}

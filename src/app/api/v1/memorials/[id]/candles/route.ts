import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { candleSchema } from "@/lib/validations/memorial";

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const parsed = candleSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid candle message.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("memorial_candles")
    .insert({
      memorial_id: id,
      user_id: auth.user.id,
      message: parsed.data.message
    })
    .select()
    .single();
  if (error) return apiError("CANDLE_CREATE_FAILED", error.message, 500);
  return apiResponse(data, { status: 201 });
}

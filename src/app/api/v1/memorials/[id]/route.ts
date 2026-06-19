import {
  apiError,
  apiOptions,
  apiResponse,
  createAppClient,
  getBearerToken,
  requireAppAuth
} from "@/lib/api-v1";
import { memorialPatchSchema } from "@/lib/validations/memorial";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = createAppClient(getBearerToken(request));
  const { data, error } = await supabase.from("memorials").select("*").eq("id", id).maybeSingle();
  if (error) return apiError("MEMORIAL_READ_FAILED", error.message, 500);
  if (!data) return apiError("MEMORIAL_NOT_FOUND", "Memorial was not found.", 404);

  const { data: candles } = await supabase
    .from("memorial_candles")
    .select("id,message,created_at")
    .eq("memorial_id", id)
    .order("created_at", { ascending: false });
  return apiResponse({ ...data, candles: candles || [] });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const parsed = memorialPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid memorial data.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("memorials")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select()
    .maybeSingle();
  if (error) return apiError("MEMORIAL_UPDATE_FAILED", error.message, 500);
  if (!data) return apiError("MEMORIAL_NOT_FOUND", "Memorial was not found.", 404);
  return apiResponse(data);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase
    .from("memorials")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("id")
    .maybeSingle();
  if (error) return apiError("MEMORIAL_DELETE_FAILED", error.message, 500);
  if (!data) return apiError("MEMORIAL_NOT_FOUND", "Memorial was not found.", 404);
  return apiResponse({ id, deleted: true });
}

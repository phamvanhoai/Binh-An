import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { gratitudePatchSchema } from "@/lib/validations/gratitude";

export function OPTIONS() {
  return apiOptions();
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const parsed = gratitudePatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid gratitude entry.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("gratitude_entries")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select()
    .maybeSingle();
  if (error) return apiError("GRATITUDE_UPDATE_FAILED", error.message, 500);
  if (!data) return apiError("GRATITUDE_NOT_FOUND", "Gratitude entry was not found.", 404);
  return apiResponse(data);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase
    .from("gratitude_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("id")
    .maybeSingle();
  if (error) return apiError("GRATITUDE_DELETE_FAILED", error.message, 500);
  if (!data) return apiError("GRATITUDE_NOT_FOUND", "Gratitude entry was not found.", 404);
  return apiResponse({ id, deleted: true });
}

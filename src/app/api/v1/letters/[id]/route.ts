import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase
    .from("future_letters")
    .select("*")
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (error) return apiError("LETTER_READ_FAILED", error.message, 500);
  if (!data) return apiError("LETTER_NOT_FOUND", "Future letter was not found.", 404);

  const isLocked = new Date(data.open_at).getTime() > Date.now();
  if (isLocked) {
    return apiResponse({
      id: data.id,
      title: data.title,
      open_at: data.open_at,
      created_at: data.created_at,
      is_locked: true
    });
  }

  if (!data.opened_at) {
    const openedAt = new Date().toISOString();
    await auth.supabase.from("future_letters").update({ opened_at: openedAt }).eq("id", id);
    data.opened_at = openedAt;
  }
  return apiResponse({ ...data, is_locked: false });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase
    .from("future_letters")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("id")
    .maybeSingle();
  if (error) return apiError("LETTER_DELETE_FAILED", error.message, 500);
  if (!data) return apiError("LETTER_NOT_FOUND", "Future letter was not found.", 404);
  return apiResponse({ id, deleted: true });
}

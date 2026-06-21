import {
  apiError,
  apiOptions,
  apiResponse,
  createAppClient,
  getBearerToken,
  requireAppAuth
} from "@/lib/api-v1";
import { prayerPatchSchema } from "@/lib/validations/prayer";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const token = getBearerToken(request);
  const supabase = createAppClient(token);
  const { data, error } = await supabase.from("prayers").select("*").eq("id", id).maybeSingle();
  if (error) return apiError("PRAYER_READ_FAILED", error.message, 500);
  if (!data) return apiError("PRAYER_NOT_FOUND", "Prayer was not found.", 404);

  let userId: string | null = null;
  if (token) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
    }
  }

  const { data: reactions } = await supabase
    .from("prayer_reactions")
    .select("user_id, reaction_type")
    .eq("prayer_id", id);

  const counts = { pray: 0, peace: 0, candle: 0 };
  const userReactions = { pray: false, peace: false, candle: false };
  (reactions || []).forEach((reaction) => {
    const type = reaction.reaction_type as keyof typeof counts;
    if (type in counts) {
      counts[type] += 1;
      if (userId && reaction.user_id === userId) {
        userReactions[type] = true;
      }
    }
  });

  return apiResponse({
    id: data.id,
    content: data.content,
    type: data.type,
    visibility: data.visibility,
    allow_reactions: data.allow_reactions,
    created_at: data.created_at,
    reactions: counts,
    user_reactions: userReactions,
    can_react: Boolean(data.allow_reactions && (!userId || data.user_id !== userId))
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const parsed = prayerPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid prayer data.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("prayers")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select()
    .maybeSingle();
  if (error) return apiError("PRAYER_UPDATE_FAILED", error.message, 500);
  if (!data) return apiError("PRAYER_NOT_FOUND", "Prayer was not found or is not owned by this user.", 404);
  return apiResponse(data);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("prayers")
    .update({ status: "deleted", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("id")
    .maybeSingle();
  if (error) return apiError("PRAYER_DELETE_FAILED", error.message, 500);
  if (!data) return apiError("PRAYER_NOT_FOUND", "Prayer was not found or is not owned by this user.", 404);
  return apiResponse({ id, deleted: true });
}

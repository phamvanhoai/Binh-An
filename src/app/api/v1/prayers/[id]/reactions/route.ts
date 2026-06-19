import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { reactionSchema } from "@/lib/validations/prayer";

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const parsed = reactionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Reaction type is invalid.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("prayer_reactions")
    .upsert(
      {
        prayer_id: id,
        user_id: auth.user.id,
        reaction_type: parsed.data.reaction_type
      },
      { onConflict: "prayer_id,user_id,reaction_type" }
    )
    .select()
    .single();
  if (error) return apiError("REACTION_CREATE_FAILED", error.message, 500);
  return apiResponse(data, { status: 201 });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const parsed = reactionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Reaction type is invalid.", 422, parsed.error.flatten());
  }

  const { error } = await auth.supabase
    .from("prayer_reactions")
    .delete()
    .eq("prayer_id", id)
    .eq("user_id", auth.user.id)
    .eq("reaction_type", parsed.data.reaction_type);
  if (error) return apiError("REACTION_DELETE_FAILED", error.message, 500);
  return apiResponse({ prayer_id: id, reaction_type: parsed.data.reaction_type, deleted: true });
}

import { apiError, apiOptions, apiResponse, createAppClient, requireAppAuth } from "@/lib/api-v1";
import { getSiteSettings } from "@/lib/site-settings";
import { prayerSchema } from "@/lib/validations/prayer";

const prayerTypes = new Set(["wish", "gratitude", "memorial", "worry", "peace"]);

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request) {
  const settings = await getSiteSettings();
  if (!settings.publicCommunityEnabled) {
    return apiResponse([], { meta: { page: 1, limit: 0, total: 0, total_pages: 1 } });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || settings.communityPageSize) || settings.communityPageSize));
  const type = url.searchParams.get("type") || "";
  if (type && !prayerTypes.has(type)) {
    return apiError("VALIDATION_ERROR", "Prayer type is invalid.", 422);
  }

  const supabase = createAppClient();
  let query = supabase
    .from("prayers")
    .select("id,content,type,allow_reactions,created_at", { count: "exact" })
    .eq("visibility", "public_anonymous")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  if (type) query = query.eq("type", type);

  const { data, count, error } = await query;
  if (error) return apiError("PRAYERS_READ_FAILED", error.message, 500);

  const ids = (data || []).map((item) => item.id);
  const { data: reactions } = ids.length
    ? await supabase.from("prayer_reactions").select("prayer_id,reaction_type").in("prayer_id", ids)
    : { data: [] };
  const counts = new Map<string, Record<string, number>>();
  (reactions || []).forEach((reaction) => {
    if (!reaction.prayer_id) return;
    const current = counts.get(reaction.prayer_id) || { pray: 0, peace: 0, candle: 0 };
    current[reaction.reaction_type] = (current[reaction.reaction_type] || 0) + 1;
    counts.set(reaction.prayer_id, current);
  });

  const total = count || 0;
  return apiResponse(
    (data || []).map((item) => ({
      ...item,
      reactions: counts.get(item.id) || { pray: 0, peace: 0, candle: 0 }
    })),
    {
      meta: {
        page,
        limit,
        total,
        total_pages: Math.max(1, Math.ceil(total / limit))
      }
    }
  );
}

export async function POST(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const parsed = prayerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid prayer data.", 422, parsed.error.flatten());
  }

  const settings = await getSiteSettings();
  const visibility = settings.publicCommunityEnabled ? parsed.data.visibility : "private";
  const status = visibility === "public_anonymous" && settings.moderateNewPrayers ? "hidden" : "active";
  const { data, error } = await auth.supabase
    .from("prayers")
    .insert({ ...parsed.data, visibility, status, user_id: auth.user.id })
    .select()
    .single();
  if (error) return apiError("PRAYER_CREATE_FAILED", error.message, 500);

  return apiResponse(
    {
      ...data,
      moderation_required: status === "hidden"
    },
    { status: 201 }
  );
}

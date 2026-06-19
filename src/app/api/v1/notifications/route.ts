import { apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { todayKey } from "@/lib/utils";

const reactionLabels: Record<string, string> = {
  pray: "đồng nguyện",
  peace: "gửi an lành",
  candle: "thắp thêm nến"
};

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const { data: prayers } = await auth.supabase
    .from("prayers")
    .select("id,content")
    .eq("user_id", auth.user.id)
    .neq("status", "deleted");
  const prayerRows = prayers || [];
  const prayerMap = new Map(prayerRows.map((prayer) => [prayer.id, prayer.content]));
  const ids = prayerRows.map((prayer) => prayer.id);

  const [reactionsResult, lettersResult, dailyResult] = await Promise.all([
    ids.length
      ? auth.supabase
          .from("prayer_reactions")
          .select("id,prayer_id,reaction_type,created_at")
          .in("prayer_id", ids)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] }),
    auth.supabase
      .from("future_letters")
      .select("id,title,open_at")
      .eq("user_id", auth.user.id)
      .is("opened_at", null)
      .lte("open_at", new Date().toISOString())
      .limit(5),
    auth.supabase
      .from("user_daily_messages")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("opened_date", todayKey())
      .maybeSingle()
  ]);

  const items = [
    ...(reactionsResult.data || []).map((reaction) => ({
      id: `reaction-${reaction.id}`,
      type: "reaction",
      title: `Có người ${reactionLabels[reaction.reaction_type] || "đồng nguyện"} cùng bạn`,
      description: prayerMap.get(reaction.prayer_id || "") || "",
      resource_id: reaction.prayer_id,
      created_at: reaction.created_at
    })),
    ...(lettersResult.data || []).map((letter) => ({
      id: `letter-${letter.id}`,
      type: "letter",
      title: "Một lá thư đã đến ngày mở",
      description: letter.title,
      resource_id: letter.id,
      created_at: letter.open_at
    }))
  ];

  if (!dailyResult.data) {
    items.push({
      id: `daily-${todayKey()}`,
      type: "daily",
      title: "Thông điệp hôm nay đang chờ bạn",
      description: "Dành một phút lắng lại cho ngày mới.",
      resource_id: todayKey(),
      created_at: `${todayKey()}T00:00:00.000Z`
    });
  }

  items.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  return apiResponse(items.slice(0, 20));
}

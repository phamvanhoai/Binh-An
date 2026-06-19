import { getUserOrError } from "@/lib/auth";
import { ok } from "@/lib/utils";
import { todayKey } from "@/lib/utils";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  created_at: string;
  type: "reaction" | "letter" | "daily";
};

const reactionLabels: Record<string, string> = {
  pray: "đồng nguyện",
  peace: "gửi an lành",
  candle: "thắp thêm nến"
};

export async function GET() {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const { data: prayers } = await auth.supabase
    .from("prayers")
    .select("id,content")
    .eq("user_id", auth.user.id)
    .neq("status", "deleted");

  const prayerRows = prayers || [];
  const prayerMap = new Map(prayerRows.map((prayer) => [prayer.id, prayer.content]));
  const prayerIds = prayerRows.map((prayer) => prayer.id);

  const [reactionsResult, lettersResult, dailyResult] = await Promise.all([
    prayerIds.length
      ? auth.supabase
          .from("prayer_reactions")
          .select("id,prayer_id,reaction_type,created_at")
          .in("prayer_id", prayerIds)
          .order("created_at", { ascending: false })
          .limit(8)
      : Promise.resolve({ data: [] }),
    auth.supabase
      .from("future_letters")
      .select("id,title,open_at")
      .eq("user_id", auth.user.id)
      .is("opened_at", null)
      .lte("open_at", new Date().toISOString())
      .order("open_at", { ascending: false })
      .limit(4),
    auth.supabase
      .from("user_daily_messages")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("opened_date", todayKey())
      .maybeSingle()
  ]);

  const items: NotificationItem[] = [
    ...(reactionsResult.data || []).map((reaction) => ({
      id: `reaction-${reaction.id}`,
      title: `Có người ${reactionLabels[reaction.reaction_type] || "đồng nguyện"} cùng bạn`,
      description: prayerMap.get(reaction.prayer_id || "") || "Một lời bình an của bạn vừa nhận được phản hồi.",
      href: `/prayers/${reaction.prayer_id}`,
      created_at: reaction.created_at || new Date().toISOString(),
      type: "reaction" as const
    })),
    ...(lettersResult.data || []).map((letter) => ({
      id: `letter-${letter.id}`,
      title: "Một lá thư đã đến ngày mở",
      description: letter.title,
      href: `/letters/${letter.id}`,
      created_at: letter.open_at,
      type: "letter" as const
    }))
  ];

  if (!dailyResult.data) {
    items.push({
      id: `daily-${todayKey()}`,
      title: "Thông điệp hôm nay đang chờ bạn",
      description: "Dành một phút lắng lại và nhận lời nhắc nhẹ nhàng cho ngày mới.",
      href: "/today",
      created_at: `${todayKey()}T00:00:00.000Z`,
      type: "daily"
    });
  }

  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return ok(items.slice(0, 10));
}

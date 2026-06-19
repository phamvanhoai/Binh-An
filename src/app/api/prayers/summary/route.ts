import { demoPrayers } from "@/lib/demo-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { ok } from "@/lib/utils";

type PrayerType = "wish" | "gratitude" | "memorial" | "worry" | "peace";
type RitualMode = "candle" | "incense" | "lantern";

const typeToMode: Record<PrayerType, RitualMode> = {
  peace: "candle",
  memorial: "incense",
  wish: "lantern",
  gratitude: "candle",
  worry: "lantern"
};

function emptyModeCounts() {
  return {
    candle: 0,
    incense: 0,
    lantern: 0
  };
}

export async function GET() {
  if (!hasSupabaseEnv()) {
    return ok({
      modeCounts: { candle: 0, incense: 0, lantern: 0 },
      totalPrayers: demoPrayers.length,
      totalReactions: 0,
      recent: demoPrayers.map((item) => ({
        id: item.id,
        text: item.content,
        mode: typeToMode[item.type as PrayerType] || "candle",
        created_at: item.created_at,
        reactionCount: item.pray + item.peace + item.candle
      })),
      top: demoPrayers.map((item) => ({
        id: item.id,
        text: item.content,
        mode: typeToMode[item.type as PrayerType] || "candle",
        created_at: item.created_at,
        reactionCount: item.pray + item.peace + item.candle
      }))
    });
  }

  const supabase = await createClient();
  const { data: prayers } = await supabase
    .from("prayers")
    .select("id, content, type, created_at")
    .eq("visibility", "public_anonymous")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(30);

  const prayerRows = prayers || [];
  const ids = prayerRows.map((item) => item.id);
  const { data: reactions } = ids.length
    ? await supabase.from("prayer_reactions").select("prayer_id").in("prayer_id", ids)
    : { data: [] };

  const reactionMap = new Map<string, number>();
  (reactions || []).forEach((item) => {
    if (!item.prayer_id) return;
    reactionMap.set(item.prayer_id, (reactionMap.get(item.prayer_id) || 0) + 1);
  });

  const modeCounts = emptyModeCounts();
  prayerRows.forEach((item) => {
    const mode = typeToMode[item.type as PrayerType] || "candle";
    modeCounts[mode] += 1;
  });

  const mapped = prayerRows.map((item) => ({
    id: item.id,
    text: item.content,
    mode: typeToMode[item.type as PrayerType] || "candle",
    created_at: item.created_at,
    reactionCount: reactionMap.get(item.id) || 0
  }));

  const totalPrayersResult = await supabase
    .from("prayers")
    .select("id", { count: "exact", head: true })
    .eq("visibility", "public_anonymous")
    .eq("status", "active");

  const totalReactionsResult = await supabase.from("prayer_reactions").select("id", { count: "exact", head: true });

  return ok({
    modeCounts,
    totalPrayers: totalPrayersResult.count || mapped.length,
    totalReactions: totalReactionsResult.count || 0,
    recent: mapped.slice(0, 5),
    top: [...mapped].sort((a, b) => b.reactionCount - a.reactionCount).slice(0, 3)
  });
}

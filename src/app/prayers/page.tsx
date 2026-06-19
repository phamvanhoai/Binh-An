import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { ChevronRight, Flame, Heart, MessageCircle, MoreHorizontal, Search, Send, Sparkles } from "lucide-react";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { demoPrayers } from "@/lib/demo-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { todayKey } from "@/lib/utils";

type PrayerType = "wish" | "gratitude" | "memorial" | "worry" | "peace";
type RitualMode = "candle" | "incense" | "lantern";

type PublicPrayer = {
  id: string;
  author: string;
  time: string;
  text: string;
  ritual: string;
  image: string;
  pray: number;
  peace: number;
};

type CommunityData = {
  prayers: PublicPrayer[];
  stats: {
    todayPrayers: number;
    totalReactions: number;
    candlePrayers: number;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  source: "supabase" | "demo";
};

const filters = ["Tất cả", "Cầu bình an", "Biết ơn", "Tưởng nhớ"];

const typeToMode: Record<PrayerType, RitualMode> = {
  peace: "candle",
  memorial: "incense",
  wish: "lantern",
  gratitude: "candle",
  worry: "lantern"
};

const modeVisuals = {
  candle: { ritual: "Nến", image: "/assets/rituals/candle.png" },
  incense: { ritual: "Hương", image: "/assets/rituals/incense.png" },
  lantern: { ritual: "Hoa đăng", image: "/assets/rituals/lantern.png" }
} satisfies Record<RitualMode, { ritual: string; image: string }>;

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatRelativeTime(value: string | null) {
  if (!value) return "Vừa xong";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  return `${Math.floor(hours / 24)} ngày trước`;
}

function fallbackData(page = 1, pageSize = 8): CommunityData {
  const total = demoPrayers.length;
  const from = (page - 1) * pageSize;
  const paged = demoPrayers.slice(from, from + pageSize);

  return {
    source: "demo",
    prayers: paged.map((item) => {
      const mode = typeToMode[item.type as PrayerType] || "candle";
      const visual = modeVisuals[mode];

      return {
        id: item.id,
        author: "Ẩn danh",
        time: formatRelativeTime(item.created_at),
        text: item.content,
        ritual: visual.ritual,
        image: visual.image,
        pray: item.pray,
        peace: item.peace
      };
    }),
    stats: {
      todayPrayers: 0,
      totalReactions: 0,
      candlePrayers: 0
    },
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    }
  };
}

async function getCommunityData(page: number, pageSize = 8): Promise<CommunityData> {
  if (!hasSupabaseEnv()) return fallbackData(page, pageSize);

  const supabase = await createClient();
  const todayStart = `${todayKey()}T00:00:00.000Z`;
  const tomorrow = new Date(todayStart);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: prayers, count: totalPrayers } = await supabase
    .from("prayers")
    .select("id, content, type, created_at", { count: "exact" })
    .eq("visibility", "public_anonymous")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(from, to);

  const rows = prayers || [];
  const ids = rows.map((item) => item.id);
  const { data: reactions } = ids.length
    ? await supabase.from("prayer_reactions").select("prayer_id, reaction_type").in("prayer_id", ids)
    : { data: [] };

  const reactionCounts = new Map<string, { pray: number; peace: number; candle: number }>();
  (reactions || []).forEach((reaction) => {
    if (!reaction.prayer_id) return;
    const current = reactionCounts.get(reaction.prayer_id) || { pray: 0, peace: 0, candle: 0 };
    if (reaction.reaction_type === "peace") current.peace += 1;
    else if (reaction.reaction_type === "candle") current.candle += 1;
    else current.pray += 1;
    reactionCounts.set(reaction.prayer_id, current);
  });

  const [todayPrayersResult, totalReactionsResult, candlePrayersResult] = await Promise.all([
    supabase
      .from("prayers")
      .select("id", { count: "exact", head: true })
      .eq("visibility", "public_anonymous")
      .eq("status", "active")
      .gte("created_at", todayStart)
      .lt("created_at", tomorrow.toISOString()),
    supabase.from("prayer_reactions").select("id", { count: "exact", head: true }),
    supabase.from("prayers").select("id", { count: "exact", head: true }).eq("visibility", "public_anonymous").eq("status", "active").eq("type", "peace")
  ]);

  return {
    source: "supabase",
    prayers: rows.map((item) => {
      const mode = typeToMode[item.type as PrayerType] || "candle";
      const visual = modeVisuals[mode];
      const counts = reactionCounts.get(item.id) || { pray: 0, peace: 0, candle: 0 };

      return {
        id: item.id,
        author: "Ẩn danh",
        time: formatRelativeTime(item.created_at),
        text: item.content,
        ritual: visual.ritual,
        image: visual.image,
        pray: counts.pray + counts.candle,
        peace: counts.peace
      };
    }),
    stats: {
      todayPrayers: todayPrayersResult.count || 0,
      totalReactions: totalReactionsResult.count || 0,
      candlePrayers: candlePrayersResult.count || 0
    },
    pagination: {
      page,
      pageSize,
      total: totalPrayers || 0,
      totalPages: Math.max(1, Math.ceil((totalPrayers || 0) / pageSize))
    }
  };
}

async function prayForPrayer(formData: FormData) {
  "use server";

  if (!hasSupabaseEnv()) return;

  const prayerId = String(formData.get("prayer_id") || "");
  if (!prayerId) return;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("prayer_reactions").upsert(
    {
      prayer_id: prayerId,
      user_id: user.id,
      reaction_type: "pray"
    },
    { onConflict: "prayer_id,user_id,reaction_type" }
  );

  revalidatePath("/prayers");
}

export default async function PrayersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page || 1) || 1);
  const data = await getCommunityData(currentPage);
  const previousPage = Math.max(1, data.pagination.page - 1);
  const nextPage = Math.min(data.pagination.totalPages, data.pagination.page + 1);

  return (
    <div className="ritual-dashboard min-h-screen overflow-x-hidden bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/prayers" variant="prayers" />

      <main className="dashboard-main">
        <header className="dashboard-frame flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Cộng đồng bình an</h1>
            <p className="mt-2 text-sm text-slate-400">
              {data.source === "supabase" ? "Đang hiển thị lời bình an thật từ Supabase." : "Chưa có Supabase, đang hiển thị dữ liệu mẫu."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm lời bình an..." />
            </label>
            <NotificationBell />
            <Link href="/profile" aria-label="Mở hồ sơ cá nhân" className="h-11 w-11 rounded-full border border-amber-200/30 bg-[radial-gradient(circle_at_40%_30%,#f8d7a1,#7c4a2f_58%,#1f2937)]" />
          </div>
        </header>

        <div className="dashboard-content-grid">
          <section className="grid gap-6">
            <section className="relative min-h-[20rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-5 shadow-2xl shadow-black/25 sm:p-8">
              <Image
                src="/assets/rituals/today-message-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover object-right"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.92),rgba(8,13,25,0.66)_48%,rgba(8,13,25,0.12))]" />
              <div className="relative z-10 max-w-2xl">
                <p className="text-4xl leading-none text-amber-400/90">“</p>
                <h2 className="mt-2 text-2xl font-medium leading-[1.45] text-amber-100 sm:text-3xl md:text-4xl">
                  Khi một người gửi bình an,
                  <br />
                  nhiều người có thể cùng
                  <br />
                  giữ ánh sáng ấy.
                </h2>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/prayers/new" className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(251,191,36,0.18)] sm:px-6 sm:text-base">
                    <Send size={18} aria-hidden="true" />
                    Gửi bình an
                  </Link>
                  <Link href="/today" className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-[#111a2b]/70 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-white/10 sm:px-6 sm:text-base">
                    <Sparkles size={18} aria-hidden="true" />
                    Đọc thông điệp
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-semibold text-white">Lời bình an công khai</h2>
                  <p className="mt-1 text-sm text-slate-400">Chỉ có đồng nguyện và gửi an lành, không có bình luận tự do.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter, index) => (
                    <button
                      key={filter}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        index === 0 ? "border-amber-300/40 bg-amber-300/10 text-amber-200" : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {data.prayers.length ? (
                  data.prayers.map((prayer) => (
                    <article key={prayer.id} className="rounded-xl border border-white/10 bg-[#101827] p-4">
                      <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
                        <RitualMiniImage src={prayer.image} className="h-14 w-16" />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                            <span className="font-semibold text-white">{prayer.author}</span>
                            <span>đã gửi bình an bằng {prayer.ritual}</span>
                            <span>•</span>
                            <span>{prayer.time}</span>
                          </div>
                          <p className="mt-2 text-base leading-7 text-white">{prayer.text}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <Heart size={15} aria-hidden="true" />
                              {formatNumber(prayer.pray)} đồng nguyện
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MessageCircle size={15} aria-hidden="true" />
                              {formatNumber(prayer.peace)} gửi an lành
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 lg:justify-end">
                          <form action={prayForPrayer}>
                            <input type="hidden" name="prayer_id" value={prayer.id} />
                            <button className="rounded-lg bg-amber-400/14 px-4 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-400/20">
                              Đồng nguyện
                            </button>
                          </form>
                          <button className="grid h-9 w-9 place-items-center rounded-full bg-white/6 text-slate-400">
                            <MoreHorizontal size={17} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-white/10 bg-[#101827] p-6 text-sm leading-6 text-slate-300">
                    Chưa có lời bình an công khai nào. Hãy là người đầu tiên gửi một lời bình an hôm nay.
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">
                  Trang {data.pagination.page} / {data.pagination.totalPages} • {formatNumber(data.pagination.total)} lời bình an
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/prayers?page=${previousPage}`}
                    aria-disabled={data.pagination.page <= 1}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      data.pagination.page <= 1
                        ? "pointer-events-none border-white/5 bg-white/[0.03] text-slate-600"
                        : "border-white/10 bg-white/6 text-slate-300 hover:text-white"
                    }`}
                  >
                    Trước
                  </Link>
                  <Link
                    href={`/prayers?page=${nextPage}`}
                    aria-disabled={data.pagination.page >= data.pagination.totalPages}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                      data.pagination.page >= data.pagination.totalPages
                        ? "pointer-events-none border-white/5 bg-white/[0.03] text-slate-600"
                        : "border-white/10 bg-white/6 text-slate-300 hover:text-white"
                    }`}
                  >
                    Sau
                  </Link>
                </div>
              </div>
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Cộng đồng đang làm gì?</h2>
              <div className="mt-5 grid gap-4">
                {[
                  { label: "Lời bình an hôm nay", value: formatNumber(data.stats.todayPrayers), icon: Send },
                  { label: "Lượt đồng nguyện", value: formatNumber(data.stats.totalReactions), icon: Heart },
                  { label: "Ngọn nến được thắp", value: formatNumber(data.stats.candlePrayers), icon: Flame }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#101827] p-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/8 text-amber-200">
                      <stat.icon size={21} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-2xl font-semibold text-white">{stat.value}</span>
                      <span className="text-xs text-slate-400">{stat.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Nguyên tắc bình an</h2>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
                <p>Không bình luận tự do để tránh tổn thương nhau.</p>
                <p>Không hiển thị tên thật nếu người gửi chọn ẩn danh.</p>
                <p>Chỉ dùng các phản hồi nhẹ: đồng nguyện, gửi an lành, thắp thêm nến.</p>
              </div>
              <Link href="/community-guidelines" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
                Xem quy tắc cộng đồng
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </section>

            <section className="relative min-h-48 overflow-hidden rounded-2xl border border-amber-200/20 p-5">
              <Image src="/assets/rituals/send-peace-hand-card.png" width={1024} height={1536} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-bottom" />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.72),rgba(8,13,25,0.12)_52%,rgba(8,13,25,0.72))]" />
              <div className="relative z-10">
                <p className="text-lg font-semibold text-white">Bạn muốn gửi điều tốt đẹp?</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Một lời bình an nhỏ có thể trở thành điểm tựa cho ai đó.</p>
                <Link href="/prayers/new" className="mt-5 inline-flex rounded-xl bg-amber-400/20 px-4 py-3 text-sm font-semibold text-amber-100">
                  Gửi ngay
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

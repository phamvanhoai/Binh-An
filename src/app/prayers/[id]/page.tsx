import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Flame, HeartHandshake, Send, Sparkles } from "lucide-react";
import { togglePrayerReaction } from "@/lib/actions/prayer-reactions";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { PrayerActionsMenu } from "@/components/prayers/PrayerActionsMenu";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

type PrayerType = "wish" | "gratitude" | "memorial" | "worry" | "peace";

const reactionOptions = [
  { type: "pray", icon: HeartHandshake, label: "Đồng nguyện" },
  { type: "peace", icon: Sparkles, label: "Gửi an lành" },
  { type: "candle", icon: Flame, label: "Thắp thêm nến" }
] as const;

const prayerVisuals: Record<PrayerType, { label: string; image: string }> = {
  peace: { label: "Nến", image: "/assets/rituals/candle.png" },
  gratitude: { label: "Nến biết ơn", image: "/assets/rituals/candle.png" },
  memorial: { label: "Hương", image: "/assets/rituals/incense.png" },
  wish: { label: "Hoa đăng", image: "/assets/rituals/lantern.png" },
  worry: { label: "Hoa đăng", image: "/assets/rituals/lantern.png" }
};

function formatDate(value: string | null) {
  if (!value) return "Vừa xong";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export default async function PrayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasSupabaseEnv()) notFound();

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: prayer, error } = await supabase
    .from("prayers")
    .select("id,user_id,content,type,visibility,status,allow_reactions,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !prayer || prayer.status !== "active" || (prayer.visibility !== "public_anonymous" && prayer.user_id !== user?.id)) {
    notFound();
  }

  const { data: reactions, error: reactionsError } = await supabase
    .from("prayer_reactions")
    .select("user_id,reaction_type")
    .eq("prayer_id", id);

  if (reactionsError) throw new Error(`Không thể tải phản hồi lời bình an: ${reactionsError.message}`);

  const counts = { pray: 0, peace: 0, candle: 0 };
  const myReactions = new Set<string>();

  (reactions || []).forEach((reaction) => {
    const type = reaction.reaction_type as keyof typeof counts;
    if (type in counts) counts[type] += 1;
    if (user && reaction.user_id === user.id) myReactions.add(type);
  });

  const visual = prayerVisuals[prayer.type as PrayerType] || prayerVisuals.peace;
  const isOwner = prayer.user_id === user?.id;
  const canReact = prayer.visibility === "public_anonymous" && prayer.allow_reactions && !isOwner;
  const totalReactions = counts.pray + counts.peace + counts.candle;

  return (
    <div className="ritual-dashboard min-h-screen overflow-x-hidden bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/prayers" variant="prayers" />

      <main className="dashboard-main">
        <header className="dashboard-frame flex items-center justify-between gap-4">
          <div>
            <Link href="/prayers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-amber-200">
              <ArrowLeft size={16} aria-hidden="true" />
              Cộng đồng bình an
            </Link>
            <h1 className="mt-3 text-2xl font-semibold text-white md:text-3xl">Chi tiết lời bình an</h1>
          </div>
          <NotificationBell />
        </header>

        <div className="dashboard-content-grid">
          <section className="grid gap-6">
            <article className="relative min-h-[29rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-5 shadow-2xl shadow-black/25 sm:p-8">
              <Image
                src="/assets/rituals/today-message-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover object-right"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.96),rgba(8,13,25,0.78)_55%,rgba(8,13,25,0.3))]" />

              <div className="relative z-10 grid min-h-[25rem] gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 font-medium text-amber-200">
                      {visual.label}
                    </span>
                    <span>{prayer.visibility === "public_anonymous" ? "Ẩn danh" : "Riêng tư"}</span>
                    <span>•</span>
                    <span>{formatDate(prayer.created_at)}</span>
                  </div>

                  <p className="mt-8 text-4xl leading-none text-amber-400/90">“</p>
                  <p className="mt-2 max-w-3xl text-2xl font-medium leading-[1.55] text-amber-50 sm:text-3xl">{prayer.content}</p>

                  <div className="mt-10 flex flex-wrap items-center gap-3">
                    <span className="text-sm text-slate-400">{totalReactions.toLocaleString("vi-VN")} phản hồi bình an</span>
                    <PrayerActionsMenu prayerId={id} canReport={!isOwner} />
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <RitualMiniImage src={visual.image} className="h-48 w-48 sm:h-56 sm:w-56" />
                </div>
              </div>
            </article>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 sm:p-6">
              <div>
                <h2 className="font-semibold text-white">Gửi một phản hồi nhẹ nhàng</h2>
                <p className="mt-1 text-sm text-slate-400">Nhấn lại phản hồi đang chọn để hủy.</p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {reactionOptions.map((item) => {
                  const active = myReactions.has(item.type);

                  return (
                    <form key={item.type} action={togglePrayerReaction}>
                      <input type="hidden" name="prayer_id" value={id} />
                      <input type="hidden" name="reaction_type" value={item.type} />
                      <input type="hidden" name="return_path" value={`/prayers/${id}`} />
                      <button
                        disabled={!canReact}
                        aria-pressed={active}
                        className={`flex min-h-24 w-full items-center gap-4 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
                          active
                            ? "border-amber-300/45 bg-amber-300/16 text-amber-50 shadow-[0_0_28px_rgba(251,191,36,0.1)]"
                            : "border-white/10 bg-[#101827] text-slate-200 hover:border-amber-300/25 hover:bg-white/[0.075]"
                        }`}
                      >
                        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${active ? "bg-amber-300/20 text-amber-200" : "bg-white/8 text-slate-300"}`}>
                          <item.icon size={21} aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{active ? `Đã ${item.label.toLowerCase()}` : item.label}</span>
                          <span className="mt-1 block text-2xl font-semibold">{counts[item.type].toLocaleString("vi-VN")}</span>
                        </span>
                      </button>
                    </form>
                  );
                })}
              </div>

              {!canReact ? (
                <p className="mt-4 rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-sm text-slate-400">
                  {isOwner ? "Bạn không thể phản hồi lời bình an của chính mình." : "Lời bình an này không nhận phản hồi."}
                </p>
              ) : null}
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Tổng phản hồi</h2>
              <div className="mt-5 grid gap-3">
                {reactionOptions.map((item) => (
                  <div key={item.type} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#101827] p-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/8 text-amber-200">
                      <item.icon size={19} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 text-sm text-slate-300">{item.label}</span>
                    <span className="text-lg font-semibold text-white">{counts[item.type].toLocaleString("vi-VN")}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Giữ không gian bình an</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Không bình luận tự do. Chỉ gửi những phản hồi nhẹ nhàng và báo cáo nội dung khi thực sự cần thiết.
              </p>
              <Link href="/community-guidelines" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
                Xem quy tắc cộng đồng
                <ChevronRight size={15} aria-hidden="true" />
              </Link>
            </section>

            <section className="relative min-h-52 overflow-hidden rounded-2xl border border-amber-200/20 p-5">
              <Image
                src="/assets/rituals/send-peace-hand-card.png"
                width={1024}
                height={1536}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-bottom"
              />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.76),rgba(8,13,25,0.12)_52%,rgba(8,13,25,0.76))]" />
              <div className="relative z-10">
                <p className="font-semibold text-white">Gửi lời bình an của bạn</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Một lời nhỏ cũng có thể giúp ai đó cảm thấy được đồng hành.</p>
                <Link href="/prayers/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-400/20 px-4 py-3 text-sm font-semibold text-amber-100">
                  <Send size={16} aria-hidden="true" />
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

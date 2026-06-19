import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Heart, PenLine, Search, Send, Sparkles, Users } from "lucide-react";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { demoMessages } from "@/lib/demo-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { todayKey } from "@/lib/utils";

const coreActions = [
  {
    href: "/today",
    title: "Đọc thông điệp hôm nay",
    text: "Mở một lời nhắc nhẹ nhàng dành cho ngày hôm nay.",
    icon: Sparkles,
    image: "/assets/rituals/today-message-bg.png"
  },
  {
    href: "/prayers/new",
    title: "Gửi bình an",
    text: "Viết lời nguyện và chọn nến, hương hoặc hoa đăng.",
    icon: Send,
    image: "/assets/rituals/send-peace-hand-card.png"
  },
  {
    href: "/prayers",
    title: "Cộng đồng đồng nguyện",
    text: "Đồng nguyện nhẹ nhàng với những lời bình an công khai.",
    icon: Users,
    image: "/assets/rituals/peace-sky-bg.png"
  }
];

type PublicPrayer = {
  id: string;
  content: string;
  type: string;
  created_at: string | null;
};

const prayerTypeVisuals: Record<string, { label: string; image: string }> = {
  peace: { label: "Nến", image: "/assets/rituals/candle.png" },
  memorial: { label: "Hương", image: "/assets/rituals/incense.png" },
  wish: { label: "Hoa đăng", image: "/assets/rituals/lantern.png" },
  gratitude: { label: "Nến biết ơn", image: "/assets/rituals/candle.png" },
  worry: { label: "Hoa đăng", image: "/assets/rituals/lantern.png" }
};

type HomeData = {
  displayName: string;
  dailyMessage: string;
  reflectionQuestion: string | null;
  dataSource: "supabase" | "demo";
  stats: {
    openedDays: number;
    myPrayers: number;
    myReactions: number;
    communityPrayers: number;
    communityReactions: number;
  };
  today: {
    openedMessage: boolean;
    sentPrayer: boolean;
    reacted: boolean;
  };
  latestPrayers: PublicPrayer[];
};

function startOfToday() {
  return `${todayKey()}T00:00:00.000Z`;
}

function startOfTomorrow() {
  const date = new Date(`${todayKey()}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString();
}

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

function fallbackData(): HomeData {
  return {
    displayName: "Minh Châu",
    dailyMessage: demoMessages[0].message,
    reflectionQuestion: demoMessages[0].reflection_question,
    dataSource: "demo",
    stats: {
      openedDays: 0,
      myPrayers: 0,
      myReactions: 0,
      communityPrayers: 0,
      communityReactions: 0
    },
    today: {
      openedMessage: false,
      sentPrayer: false,
      reacted: false
    },
    latestPrayers: []
  };
}

async function getHomeData(): Promise<HomeData> {
  if (!hasSupabaseEnv()) return fallbackData();

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const openedDate = todayKey();
  const todayStart = startOfToday();
  const tomorrowStart = startOfTomorrow();
  const base = fallbackData();

  let displayName = user?.email?.split("@")[0] || "bạn";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
    displayName = profile?.display_name || user.user_metadata?.name || displayName;
  }

  let dailyMessage = base.dailyMessage;
  let reflectionQuestion = base.reflectionQuestion;

  if (user) {
    const { data: existing } = await supabase
      .from("user_daily_messages")
      .select("daily_messages(message, reflection_question)")
      .eq("user_id", user.id)
      .eq("opened_date", openedDate)
      .maybeSingle();

    const message = Array.isArray(existing?.daily_messages) ? existing?.daily_messages[0] : existing?.daily_messages;
    if (message?.message) {
      dailyMessage = message.message;
      reflectionQuestion = message.reflection_question;
    }
  }

  if (dailyMessage === base.dailyMessage) {
    const { data: datedMessage } = await supabase
      .from("daily_messages")
      .select("message, reflection_question")
      .eq("is_active", true)
      .eq("active_date", openedDate)
      .maybeSingle();

    const { data: fallbackMessage } = datedMessage
      ? { data: null }
      : await supabase.from("daily_messages").select("message, reflection_question").eq("is_active", true).limit(1).maybeSingle();

    const message = datedMessage || fallbackMessage;
    if (message?.message) {
      dailyMessage = message.message;
      reflectionQuestion = message.reflection_question;
    }
  }

  const [
    openedDaysResult,
    myPrayersResult,
    myReactionsResult,
    communityPrayersResult,
    communityReactionsResult,
    todayMessageResult,
    todayPrayerResult,
    todayReactionResult,
    latestPrayersResult
  ] = await Promise.all([
    user
      ? supabase.from("user_daily_messages").select("id", { count: "exact", head: true }).eq("user_id", user.id)
      : Promise.resolve({ count: 0 }),
    user
      ? supabase.from("prayers").select("id", { count: "exact", head: true }).eq("user_id", user.id).neq("status", "deleted")
      : Promise.resolve({ count: 0 }),
    user
      ? supabase.from("prayer_reactions").select("id", { count: "exact", head: true }).eq("user_id", user.id)
      : Promise.resolve({ count: 0 }),
    supabase.from("prayers").select("id", { count: "exact", head: true }).eq("visibility", "public_anonymous").eq("status", "active"),
    supabase.from("prayer_reactions").select("id", { count: "exact", head: true }),
    user
      ? supabase.from("user_daily_messages").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("opened_date", openedDate)
      : Promise.resolve({ count: 0 }),
    user
      ? supabase
          .from("prayers")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", todayStart)
          .lt("created_at", tomorrowStart)
          .neq("status", "deleted")
      : Promise.resolve({ count: 0 }),
    user
      ? supabase
          .from("prayer_reactions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", todayStart)
          .lt("created_at", tomorrowStart)
      : Promise.resolve({ count: 0 }),
    supabase
      .from("prayers")
      .select("id, content, type, created_at")
      .eq("visibility", "public_anonymous")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(3)
  ]);

  return {
    displayName,
    dailyMessage,
    reflectionQuestion,
    dataSource: "supabase",
    stats: {
      openedDays: openedDaysResult.count || 0,
      myPrayers: myPrayersResult.count || 0,
      myReactions: myReactionsResult.count || 0,
      communityPrayers: communityPrayersResult.count || 0,
      communityReactions: communityReactionsResult.count || 0
    },
    today: {
      openedMessage: Boolean(todayMessageResult.count),
      sentPrayer: Boolean(todayPrayerResult.count),
      reacted: Boolean(todayReactionResult.count)
    },
    latestPrayers: (latestPrayersResult.data || []) as PublicPrayer[]
  };
}

export default async function Home() {
  const data = await getHomeData();
  const completedToday = [data.today.openedMessage, data.today.sentPrayer, data.today.reacted].filter(Boolean).length;
  const completionWidth = `${(completedToday / 3) * 100}%`;
  const todaySteps = [
    { label: "Đọc một thông điệp", done: data.today.openedMessage, href: "/today" },
    { label: "Gửi một lời bình an", done: data.today.sentPrayer, href: "/prayers/new" },
    { label: "Đồng nguyện với một người khác", done: data.today.reacted, href: "/prayers" }
  ];

  return (
    <div className="ritual-dashboard min-h-screen overflow-x-hidden bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/" variant="prayers" />

      <main className="dashboard-main">
        <header className="dashboard-frame flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl">Chào buổi tối, {data.displayName} 🌺</h1>
            <p className="mt-2 text-sm text-slate-400">
              {data.dataSource === "supabase" ? "Dữ liệu đang được lấy từ Supabase." : "Chưa có kết nối Supabase, đang hiển thị dữ liệu mẫu."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm lời nguyện, thông điệp..." />
            </label>
            <NotificationBell />
            <Link
              href="/profile"
              aria-label="Mở hồ sơ cá nhân"
              className="h-11 w-11 rounded-full border border-amber-200/30 bg-[radial-gradient(circle_at_40%_30%,#f8d7a1,#7c4a2f_58%,#1f2937)]"
            />
          </div>
        </header>

        <div className="dashboard-content-grid">
          <section className="grid gap-6">
            <section className="relative min-h-[25rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-5 shadow-2xl shadow-black/25 sm:min-h-[23rem] sm:p-8">
              <Image
                src="/assets/rituals/today-message-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover object-[66%_center] sm:object-right"
              />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.9),rgba(8,13,25,0.58)_48%,rgba(8,13,25,0.24)_100%)] sm:bg-[linear-gradient(90deg,rgba(8,13,25,0.92),rgba(8,13,25,0.65)_48%,rgba(8,13,25,0.1)_82%)]" />
              <div className="relative z-10 flex min-h-[20rem] max-w-2xl flex-col justify-center">
                <p className="text-4xl leading-none text-amber-400/90 sm:text-5xl">“</p>
                <h2 className="mt-2 text-2xl font-medium leading-[1.45] text-amber-100 sm:text-3xl md:text-4xl">{data.dailyMessage}</h2>
                {data.reflectionQuestion ? <p className="mt-5 max-w-xl text-sm leading-6 text-slate-200">{data.reflectionQuestion}</p> : null}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/today" className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(251,191,36,0.18)] sm:px-6 sm:text-base">
                    <Sparkles size={18} aria-hidden="true" />
                    Mở thông điệp hôm nay
                  </Link>
                  <Link href="/prayers/new" className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-[#111a2b]/70 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-white/10 sm:px-6 sm:text-base">
                    <PenLine size={18} aria-hidden="true" />
                    Gửi bình an
                  </Link>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              {coreActions.map((item) => (
                <Link key={item.href} href={item.href} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-amber-200/30">
                  <div className="relative h-40">
                    <Image src={item.image} width={900} height={520} alt="" aria-hidden="true" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.12),rgba(8,13,25,0.78))]" />
                    <span className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-full bg-amber-300/14 text-amber-200 backdrop-blur">
                      <item.icon size={24} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{item.text}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
                      Bắt đầu
                      <ChevronRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-white">Lời nhắc nhẹ nhàng</h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
                    Mỗi ngày bạn không cần làm quá nhiều. Chỉ cần một thông điệp để lắng lại, một lời bình an để gửi đi, hoặc một lần đồng nguyện thật lòng với ai đó.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#101827] p-4">
                  <p className="text-sm text-slate-400">Hôm nay bạn đã hoàn thành</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{completedToday} / 3</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500" style={{ width: completionWidth }} />
                  </div>
                </div>
              </div>
            </section>

            {data.latestPrayers.length ? (
              <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-white">Lời bình an mới từ cộng đồng</h2>
                    <p className="mt-1 text-sm text-slate-400">Những lời nguyện công khai vừa được gửi đi.</p>
                  </div>
                  <Link href="/prayers" className="inline-flex items-center gap-2 text-sm text-amber-200">
                    Xem tất cả
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  {data.latestPrayers.map((prayer) => {
                    const visual = prayerTypeVisuals[prayer.type] || prayerTypeVisuals.peace;

                    return (
                      <Link
                        key={prayer.id}
                        href="/prayers"
                        className="group rounded-xl border border-white/10 bg-[#101827] p-4 transition hover:-translate-y-0.5 hover:border-amber-200/30 hover:bg-white/[0.075]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <RitualMiniImage src={visual.image} className="h-12 w-14" />
                          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-200">
                            {visual.label}
                          </span>
                        </div>
                        <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-100">{prayer.content}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-500">
                          <span>{formatRelativeTime(prayer.created_at)}</span>
                          <span className="inline-flex items-center gap-1 text-amber-200 transition group-hover:translate-x-0.5">
                            Đồng nguyện
                            <ChevronRight size={13} aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </section>

          <aside className="grid min-w-0 content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Việc nên làm hôm nay</h2>
              <div className="mt-5 grid gap-4">
                {todaySteps.map((step, index) => (
                  <Link key={step.label} href={step.href} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101827] p-4 hover:bg-white/8">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${step.done ? "bg-emerald-400/16 text-emerald-200" : "bg-amber-300/12 text-amber-200"}`}>
                      {step.done ? <Check size={16} aria-hidden="true" /> : index + 1}
                    </span>
                    <span className="text-sm text-slate-200">{step.label}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Dữ liệu của bạn</h2>
              <div className="mt-5 grid gap-4">
                {[
                  { label: "Ngày đã mở thông điệp", value: formatNumber(data.stats.openedDays), icon: Sparkles },
                  { label: "Lời bình an đã gửi", value: formatNumber(data.stats.myPrayers), icon: Heart },
                  { label: "Lượt bạn đã đồng nguyện", value: formatNumber(data.stats.myReactions), icon: Users }
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
              <Link href="/profile" className="mt-5 flex justify-center rounded-xl bg-white/6 px-4 py-3 text-sm font-semibold text-amber-100 hover:bg-white/10">
                Xem hồ sơ
              </Link>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Dữ liệu cộng đồng</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-[#101827] p-4">
                  <p className="text-2xl font-semibold text-white">{formatNumber(data.stats.communityPrayers)}</p>
                  <p className="mt-1 text-xs text-slate-400">Lời bình an công khai</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#101827] p-4">
                  <p className="text-2xl font-semibold text-white">{formatNumber(data.stats.communityReactions)}</p>
                  <p className="mt-1 text-xs text-slate-400">Lượt đồng nguyện</p>
                </div>
              </div>
            </section>

            <section className="relative min-h-48 overflow-hidden rounded-2xl border border-amber-200/20 p-5">
              <Image src="/assets/rituals/send-peace-hand-card.png" width={1024} height={1536} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-bottom" />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.78),rgba(8,13,25,0.2)_52%,rgba(8,13,25,0.7))]" />
              <div className="relative z-10">
                <RitualMiniImage src="/assets/rituals/lantern.png" className="h-12 w-14" />
                <p className="mt-4 max-w-xs text-lg leading-8 text-slate-100">“Một lời bình an nhỏ cũng có thể làm dịu một ngày dài.”</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

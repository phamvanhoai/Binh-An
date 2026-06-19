import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  Edit3,
  Flame,
  Heart,
  Mail,
  Medal,
  Search,
  Sparkles,
  UserRound
} from "lucide-react";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

type Activity = {
  id: string;
  title: string;
  createdAt: string;
  image: string;
  href: string;
};

type ProfileData = {
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  joinedAt: string | null;
  stats: {
    streak: number;
    prayers: number;
    gratitude: number;
    companions: number;
  };
  goals: Array<{ label: string; current: number; target: number }>;
  activities: Activity[];
};

const ritualImages: Record<string, string> = {
  peace: "/assets/rituals/candle.png",
  gratitude: "/assets/rituals/candle.png",
  memorial: "/assets/rituals/incense.png",
  wish: "/assets/rituals/lantern.png",
  worry: "/assets/rituals/lantern.png"
};

function dateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day + 1);
  return date.toISOString();
}

function calculateStreak(openedDates: string[]) {
  const dates = new Set(openedDates);
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!dates.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dates.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function formatJoinedDate(value: string | null) {
  if (!value) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function formatActivityTime(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ trước`;
  if (minutes < 10080) return `${Math.floor(minutes / 1440)} ngày trước`;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

async function getProfileData(): Promise<ProfileData> {
  if (!hasSupabaseEnv()) redirect("/login?next=/profile");

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/profile");

  const weekStart = startOfWeek();
  const [
    profileResult,
    prayersResult,
    gratitudeResult,
    lettersResult,
    openedDaysResult,
    weeklyPrayersResult,
    weeklyGratitudeResult,
    weeklyReactionsResult
  ] = await Promise.all([
    supabase.from("profiles").select("display_name,bio,avatar_url,created_at").eq("id", user.id).maybeSingle(),
    supabase
      .from("prayers")
      .select("id,content,type,created_at")
      .eq("user_id", user.id)
      .neq("status", "deleted")
      .order("created_at", { ascending: false }),
    supabase
      .from("gratitude_entries")
      .select("id,content,entry_date,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("future_letters")
      .select("id,title,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("user_daily_messages")
      .select("opened_date")
      .eq("user_id", user.id)
      .order("opened_date", { ascending: false }),
    supabase
      .from("prayers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "deleted")
      .gte("created_at", weekStart),
    supabase
      .from("gratitude_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", weekStart),
    supabase
      .from("prayer_reactions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", weekStart)
  ]);

  const prayers = prayersResult.data || [];
  const gratitudeEntries = gratitudeResult.data || [];
  const letters = lettersResult.data || [];
  const prayerIds = prayers.map((prayer) => prayer.id);

  const receivedReactions = prayerIds.length
    ? await supabase.from("prayer_reactions").select("user_id").in("prayer_id", prayerIds)
    : { data: [] as Array<{ user_id: string | null }> };

  const companionIds = new Set(
    (receivedReactions.data || []).map((reaction) => reaction.user_id).filter((id): id is string => Boolean(id))
  );

  const activities: Activity[] = [
    ...prayers.slice(0, 5).map((prayer) => ({
      id: `prayer-${prayer.id}`,
      title: `Bạn đã gửi một lời bình an: “${prayer.content}”`,
      createdAt: prayer.created_at || new Date().toISOString(),
      image: ritualImages[prayer.type] || ritualImages.peace,
      href: `/prayers/${prayer.id}`
    })),
    ...gratitudeEntries.slice(0, 5).map((entry) => ({
      id: `gratitude-${entry.id}`,
      title: `Bạn đã ghi lại điều biết ơn: “${entry.content}”`,
      createdAt: entry.created_at || `${entry.entry_date}T00:00:00`,
      image: "/assets/rituals/candle.png",
      href: "/gratitude"
    })),
    ...letters.map((letter) => ({
      id: `letter-${letter.id}`,
      title: `Bạn đã viết lá thư “${letter.title}”`,
      createdAt: letter.created_at || new Date().toISOString(),
      image: "/assets/rituals/lantern.png",
      href: `/letters/${letter.id}`
    }))
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const profile = profileResult.data;

  return {
    email: user.email || "Chưa có email",
    displayName: profile?.display_name || user.user_metadata?.name || user.email?.split("@")[0] || "Người dùng Bình An",
    bio: profile?.bio || "Đang nuôi dưỡng một hành trình bình an mỗi ngày.",
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    joinedAt: profile?.created_at || user.created_at || null,
    stats: {
      streak: calculateStreak((openedDaysResult.data || []).map((row) => row.opened_date)),
      prayers: prayers.length,
      gratitude: gratitudeEntries.length,
      companions: companionIds.size
    },
    goals: [
      { label: "Gửi bình an 5 lần", current: weeklyPrayersResult.count || 0, target: 5 },
      { label: "Ghi biết ơn 7 lần", current: weeklyGratitudeResult.count || 0, target: 7 },
      { label: "Đồng nguyện 10 lần", current: weeklyReactionsResult.count || 0, target: 10 }
    ],
    activities
  };
}

export default async function ProfilePage() {
  const profile = await getProfileData();
  const achievements = [
    { title: "Người giữ lửa", text: `Đã duy trì ${profile.stats.streak} ngày bình an liên tục`, icon: Flame },
    { title: "Trái tim biết ơn", text: `Đã ghi lại ${profile.stats.gratitude} điều biết ơn`, icon: Heart },
    { title: "Lan tỏa bình an", text: `Đã có ${profile.stats.companions} người đồng nguyện cùng bạn`, icon: Sparkles }
  ];

  const stats = [
    { label: "Ngày liên tục", value: profile.stats.streak, icon: Flame },
    { label: "Lời bình an", value: profile.stats.prayers, icon: Sparkles },
    { label: "Điều biết ơn", value: profile.stats.gratitude, icon: Heart },
    { label: "Người đồng nguyện", value: profile.stats.companions, icon: Medal }
  ];

  return (
    <div className="ritual-dashboard min-h-screen overflow-x-hidden bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/profile" variant="prayers" />

      <main className="dashboard-main">
        <header className="dashboard-frame flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Hồ sơ của tôi</h1>
            <p className="mt-2 text-sm text-slate-400">Thông tin và hành trình Bình An được cập nhật từ tài khoản của bạn.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm kiếm hoạt động..." />
            </label>
            <NotificationBell />
          </div>
        </header>

        <div className="dashboard-content-grid">
          <section className="grid gap-6">
            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-5 shadow-2xl shadow-black/25 sm:p-8">
              <Image src="/assets/rituals/today-message-bg.png" width={1792} height={1024} alt="" aria-hidden="true" priority className="absolute inset-0 h-full w-full object-cover object-right" />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.92),rgba(8,13,25,0.72)_48%,rgba(8,13,25,0.22))]" />

              <div className="relative z-10 grid gap-7 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
                <span
                  className="grid h-28 w-28 place-items-center rounded-full border border-amber-200/30 bg-[radial-gradient(circle_at_40%_30%,#f8d7a1,#9a5d34_58%,#172033)] bg-cover bg-center shadow-[0_0_45px_rgba(251,191,36,0.18)] sm:h-32 sm:w-32"
                  style={profile.avatarUrl ? { backgroundImage: `url("${profile.avatarUrl}")` } : undefined}
                >
                  {!profile.avatarUrl ? <UserRound size={58} className="text-amber-50" aria-hidden="true" /> : null}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-200/80">Tài khoản Bình An</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{profile.displayName}</h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200">{profile.bio}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2">
                      <Mail size={16} className="shrink-0" aria-hidden="true" />
                      <span className="truncate">{profile.email}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2">
                      <CalendarDays size={16} aria-hidden="true" />
                      Tham gia {formatJoinedDate(profile.joinedAt)}
                    </span>
                  </div>
                </div>
                <Link href="/profile/edit" className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-5 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(251,191,36,0.18)] transition hover:brightness-110">
                  <Edit3 size={17} aria-hidden="true" />
                  Chỉnh sửa hồ sơ
                </Link>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
                  <stat.icon className="text-amber-300" size={24} aria-hidden="true" />
                  <p className="mt-4 text-3xl font-semibold text-white">{stat.value.toLocaleString("vi-VN")}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Thành tựu Bình An</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {achievements.map((item) => (
                  <article key={item.title} className="rounded-xl border border-white/10 bg-[#101827] p-5">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-300/10 text-amber-300">
                      <item.icon size={24} aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold text-white">Hoạt động gần đây</h2>
                <Link href="/prayers" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-200">
                  Xem lời bình an
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              </div>
              {profile.activities.length ? (
                <div className="divide-y divide-white/10 rounded-xl bg-[#101827] px-4">
                  {profile.activities.map((item) => (
                    <Link key={item.id} href={item.href} className="flex items-center gap-4 py-4">
                      <RitualMiniImage src={item.image} className="h-10 w-12" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-white">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatActivityTime(item.createdAt)}</p>
                      </div>
                      <ChevronRight size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-[#101827] px-5 py-10 text-center text-sm text-slate-400">
                  Bạn chưa có hoạt động nào. Hãy gửi lời bình an đầu tiên.
                </div>
              )}
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Mục tiêu tuần này</h2>
              <div className="mt-5 grid gap-5">
                {profile.goals.map((goal) => {
                  const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));

                  return (
                    <div key={goal.label}>
                      <div className="mb-2 flex justify-between gap-3 text-sm">
                        <span className="text-slate-300">{goal.label}</span>
                        <span className="shrink-0 text-amber-200">{goal.current}/{goal.target}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <span className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="relative min-h-56 overflow-hidden rounded-2xl border border-amber-200/20 p-6">
              <Image src="/assets/rituals/send-peace-hand-card.png" width={1024} height={1536} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-bottom" />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.78),rgba(8,13,25,0.18)_52%,rgba(8,13,25,0.7))]" />
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-white">Gợi ý hôm nay</h2>
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-200">Dành vài phút để ghi lại một điều biết ơn hoặc gửi bình an đến người bạn yêu thương.</p>
                <Link href="/gratitude/new" className="mt-5 inline-flex rounded-xl bg-amber-400/20 px-4 py-3 text-sm font-semibold text-amber-100">
                  Viết ngay
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

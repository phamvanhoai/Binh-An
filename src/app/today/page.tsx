import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Flame,
  Heart,
  Leaf,
  Link2,
  Search,
  Send,
  Star,
  Users
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { demoMessages } from "@/lib/demo-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { todayKey } from "@/lib/utils";

type DailyMessage = {
  id?: string;
  message: string;
  reflection_question?: string | null;
  category?: string | null;
  opened_date?: string | null;
};

const favoriteMessages = [
  { text: "Cuộc sống là 10% những gì xảy ra với bạn và 90% cách bạn phản ứng với nó.", likes: "2.458", image: "/assets/rituals/candle.png" },
  { text: "Điều duy nhất cản trở bạn là câu chuyện bạn tự kể với chính mình.", likes: "1.987", image: "/assets/rituals/lantern.png" },
  { text: "Mỗi ngày là một cơ hội mới để trở thành phiên bản tốt hơn của chính mình.", likes: "1.756", image: "/assets/rituals/candle.png" }
];

const reflectionCards = [
  { icon: Heart, title: "Hôm nay điều gì khiến bạn biết ơn?", text: "Dành vài phút để nghĩ về những điều tốt đẹp xung quanh bạn." },
  { icon: Leaf, title: "Bạn đã tử tế với chính mình chưa?", text: "Hãy yêu thương bản thân nhiều hơn, bạn xứng đáng với điều đó." },
  { icon: Users, title: "Ai là người bạn muốn gửi lời cảm ơn hôm nay?", text: "Một lời cảm ơn chân thành có thể làm ấm lòng ai đó." },
  { icon: Star, title: "Mục tiêu nhỏ hôm nay của bạn là gì?", text: "Những bước nhỏ mỗi ngày sẽ dẫn bạn đến những điều lớn lao." }
];

type RecentMessage = { id: string; text: string; date: string };

const activities = [
  { text: "Bạn đã xem thông điệp hôm nay", time: "07:30", icon: Leaf },
  { text: "Bạn đã thắp 1 nến", time: "07:28", icon: Flame },
  { text: "Bạn đã gửi lời nguyện", time: "07:25", icon: Send },
  { text: "Bạn nhận được 5 lượt đồng nguyện", time: "07:20", icon: Heart }
];

function formatDate(value?: string | null) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();

  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

async function getTodayData(): Promise<{ message: DailyMessage; recentMessages: RecentMessage[]; source: "supabase" | "demo" }> {
  const fallback = {
    message: { ...demoMessages[0], opened_date: todayKey() },
    recentMessages: demoMessages.map((item, index) => ({
      id: item.id,
      text: item.message,
      date: formatDate(todayKey(new Date(Date.now() - index * 86400000)))
    })),
    source: "demo" as const
  };

  if (!hasSupabaseEnv()) return fallback;

  const supabase = await createClient();
  const openedDate = todayKey();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from("user_daily_messages")
      .select("opened_date, daily_messages(id, message, reflection_question, category)")
      .eq("user_id", user.id)
      .eq("opened_date", openedDate)
      .maybeSingle();

    const existingMessage = Array.isArray(existing?.daily_messages) ? existing?.daily_messages[0] : existing?.daily_messages;
    if (existingMessage?.message) {
      const { data: recent } = await supabase
        .from("daily_messages")
        .select("id, message, active_date, created_at")
        .eq("is_active", true)
        .order("active_date", { ascending: false, nullsFirst: false })
        .limit(5);

      return {
        message: { ...existingMessage, opened_date: existing?.opened_date || openedDate },
        recentMessages: (recent || []).map((item) => ({
          id: item.id,
          text: item.message,
          date: formatDate(item.active_date || item.created_at?.slice(0, 10))
        })),
        source: "supabase"
      };
    }
  }

  const { data: datedMessage } = await supabase
    .from("daily_messages")
    .select("id, message, reflection_question, category")
    .eq("is_active", true)
    .eq("active_date", openedDate)
    .maybeSingle();

  const { data: fallbackMessage } = datedMessage
    ? { data: null }
    : await supabase.from("daily_messages").select("id, message, reflection_question, category").eq("is_active", true).limit(1).maybeSingle();

  const message = datedMessage || fallbackMessage;
  if (!message) return fallback;

  if (user) {
    await supabase.from("user_daily_messages").insert({
      user_id: user.id,
      message_id: message.id,
      opened_date: openedDate
    });
  }

  const { data: recent } = await supabase
    .from("daily_messages")
    .select("id, message, active_date, created_at")
    .eq("is_active", true)
    .order("active_date", { ascending: false, nullsFirst: false })
    .limit(5);

  return {
    message: { ...message, opened_date: openedDate },
    recentMessages: (recent || []).map((item) => ({
      id: item.id,
      text: item.message,
      date: formatDate(item.active_date || item.created_at?.slice(0, 10))
    })),
    source: "supabase"
  };
}

export default async function TodayPage() {
  const { message, recentMessages, source } = await getTodayData();
  const heroMessage = message.message;
  const heroReflection = message.reflection_question || "Hãy hít thở sâu, mỉm cười và biết ơn những điều đang có trong hiện tại.";

  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/today" variant="today" />

      <main className="dashboard-main">
        <header className="dashboard-frame flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Thông điệp hôm nay</h1>
            <p className="mt-2 text-sm text-slate-400">
              {source === "supabase" ? "Thông điệp đang được lấy từ dữ liệu Supabase." : "Chưa có dữ liệu Supabase, đang hiển thị thông điệp mẫu."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm kiếm lời nguyện, người dùng..." />
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
            <section className="relative min-h-[34rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-7 shadow-2xl shadow-black/25">
              <Image
                src="/assets/rituals/today-message-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.9),rgba(8,13,25,0.56)_46%,rgba(8,13,25,0.18)_78%,rgba(8,13,25,0.38))]" />

              <div className="relative z-10 max-w-xl">
                <h2 className="text-2xl font-semibold text-white">Thông điệp hôm nay</h2>
                <p className="mt-3 text-sm text-slate-300">{formatDate(message.opened_date)}</p>
                <p className="mt-10 text-5xl leading-none text-amber-300/70">“</p>
                <blockquote className="mt-1 text-3xl font-medium leading-[1.45] text-amber-100 md:text-4xl">
                  {heroMessage}
                </blockquote>
                <p className="mt-7 max-w-md text-base leading-7 text-slate-200">{heroReflection}</p>
              </div>

              <div className="absolute bottom-5 left-6 right-6 z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="inline-flex max-w-max items-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm text-slate-200 backdrop-blur">
                  <Heart size={16} className="fill-amber-200 text-amber-200" aria-hidden="true" />
                  Thông điệp chỉ hiển thị trong ngày và sẽ <span className="font-semibold text-amber-200">thay đổi vào ngày mai</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span>Chia sẻ thông điệp</span>
                  {[Facebook, Send, Link2].map((Icon, index) => (
                    <button key={index} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/16">
                      <Icon size={17} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <h2 className="font-semibold text-white">Gợi ý suy ngẫm</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {reflectionCards.map((card) => (
                  <article key={card.title} className="rounded-xl border border-white/10 bg-[#121a2a] p-4 text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10 text-amber-200 shadow-[0_0_28px_rgba(251,191,36,0.12)]">
                      <card.icon size={30} fill="currentColor" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 min-h-12 text-base font-semibold leading-6 text-amber-100">{card.title}</h3>
                    <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{card.text}</p>
                    <button className="mt-4 w-full rounded-lg bg-white/6 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-white/10">
                      Suy ngẫm ngay
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <h2 className="font-semibold text-white">Thông điệp những ngày gần đây</h2>
              <div className="mt-4 flex items-stretch gap-3">
                <button className="my-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/8 text-amber-200">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {recentMessages.map((item) => (
                    <article key={item.id} className="rounded-xl border border-white/10 bg-[#121a2a] p-4">
                      <p className="text-2xl leading-none text-amber-300/80">“</p>
                      <p className="mt-1 min-h-28 text-sm leading-6 text-slate-200">{item.text}</p>
                      <p className="mt-4 text-xs text-slate-500">{item.date}</p>
                    </article>
                  ))}
                </div>
                <button className="my-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/8 text-amber-200">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Thông điệp được yêu thích</h2>
              <div className="mt-5 grid gap-3">
                {favoriteMessages.map((item) => (
                  <article key={item.text} className="grid grid-cols-[5.6rem_minmax(0,1fr)] gap-4 rounded-xl border border-white/10 bg-[#121a2a] p-3">
                    <div className="relative h-20 overflow-hidden rounded-lg bg-[#0b1220]">
                      <Image src={item.image} width={180} height={180} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 bg-amber-300/10" />
                    </div>
                    <div>
                      <p className="text-sm leading-6 text-slate-100">{item.text}</p>
                      <p className="mt-2 flex items-center justify-end gap-1 text-xs text-slate-400">
                        <Heart size={13} className="fill-rose-400 text-rose-400" aria-hidden="true" />
                        {item.likes}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <Link href="/today" className="mt-3 flex justify-center rounded-xl bg-white/6 px-4 py-3 text-sm text-slate-300 hover:text-white">
                Xem tất cả
              </Link>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Hoạt động của bạn</h2>
              <div className="mt-4 divide-y divide-white/10 rounded-xl bg-[#121a2a] px-4">
                {activities.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 py-3 text-sm">
                    <item.icon className="text-amber-300" size={16} aria-hidden="true" />
                    <span className="flex-1 text-slate-300">{item.text}</span>
                    <span className="text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
              <Link href="/profile" className="mt-3 flex justify-center rounded-xl bg-white/6 px-4 py-3 text-sm text-slate-300 hover:text-white">
                Xem tất cả
              </Link>
            </section>

            <section className="relative min-h-72 overflow-hidden rounded-2xl border border-amber-200/20 p-7">
              <Image
                src="/assets/rituals/send-peace-card.png"
                width={1024}
                height={1536}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.45),rgba(15,23,42,0.12),rgba(15,23,42,0.42))]" />
              <div className="relative z-10 ml-auto max-w-xs text-right">
                <p className="text-lg leading-8 text-slate-100">“Mỗi ngày là một trang sách mới của cuộc đời bạn. Hãy viết nên những điều thật đẹp.”</p>
                <p className="mt-5 text-sm text-slate-200">— Bình An</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

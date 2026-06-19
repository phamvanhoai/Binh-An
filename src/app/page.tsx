import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Flame,
  Heart,
  Mail,
  PenLine,
  Search,
  Sparkles,
  Users
} from "lucide-react";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";

const shortcuts = [
  { href: "/prayers/new", title: "Thắp nến", subtitle: "Gửi lời nguyện", icon: Flame, image: "/assets/rituals/candle.png" },
  { href: "/today", title: "Thả hoa đăng", subtitle: "Ước nguyện bình an", icon: Sparkles, image: "/assets/rituals/lantern.png" },
  { href: "/sky", title: "Bầu trời bình an", subtitle: "Lời nguyện lan tỏa", icon: Sparkles, image: "/assets/rituals/lantern.png" },
  { href: "/letters", title: "Gửi mình trong tương lai", subtitle: "Viết thư", icon: Mail, image: "/assets/rituals/lantern.png" },
  { href: "/gratitude", title: "Hành trình biết ơn", subtitle: "Nuôi dưỡng mỗi ngày", icon: Heart, image: "/assets/rituals/lantern.png" },
  { href: "/prayers", title: "Bạn bè & Đồng nguyện", subtitle: "Đồng hành", icon: Users, image: "/assets/rituals/lantern.png" }
];

const journeys = [
  {
    title: "Thắp nến biết ơn",
    text: "Ghi lại điều tốt đẹp trong ngày",
    time: "5 phút",
    image: "/assets/rituals/gratitude-bg.png"
  },
  {
    title: "Thả hoa đăng",
    text: "Gửi đi ước nguyện bình an",
    time: "3 phút",
    image: "/assets/rituals/today-message-bg.png"
  },
  {
    title: "Nhật ký biết ơn",
    text: "Viết 3 điều bạn biết ơn hôm nay",
    time: "7 phút",
    image: "/assets/rituals/future-write-card.png"
  },
  {
    title: "Bầu trời bình an",
    text: "Lan tỏa yêu thương đến mọi người",
    time: "10 phút",
    image: "/assets/rituals/peace-sky-bg.png"
  }
];

const favorites = [
  { title: "Lời nguyện bình an", count: "2.351", image: "/assets/rituals/lantern.png" },
  { title: "Cầu cho cha mẹ", count: "1.987", image: "/assets/rituals/candle.png" },
  { title: "Cầu may mắn", count: "1.756", icon: "☘" },
  { title: "Cầu cho sức khỏe", count: "1.452", icon: "❤" },
  { title: "Cầu cho gia đình", count: "1.214", icon: "👥" }
];

const reminders = [
  {
    text: "Hãy bắt đầu mỗi ngày với lòng biết ơn.",
    author: "Bình An",
    image: "/assets/rituals/candle.png"
  },
  {
    text: "Bạn không thể quay lại quá khứ để thay đổi khởi đầu, nhưng bạn có thể bắt đầu từ hôm nay để thay đổi kết thúc.",
    author: "Bình An",
    image: "/assets/rituals/lantern.png"
  },
  {
    text: "Yêu thương không bao giờ mất đi, nó chỉ chuyển thành ký ức để luôn ở bên ta.",
    author: "Phật giáo",
    image: "/assets/rituals/candle.png"
  },
  {
    text: "Hạnh phúc không phải là đích đến, mà là cách bạn đi trên hành trình của chính mình.",
    author: "Bình An",
    image: "/assets/rituals/lantern.png"
  }
];

const events = [
  { title: "Đêm hoa đăng tri ân", time: "15/06/2024 - 20:00" },
  { title: "Ngày của lòng biết ơn", time: "21/06/2024 - Cả ngày" },
  { title: "Thắp nến cầu nguyện", time: "01/07/2024 - 19:00" }
];

const activities = [
  { name: "Minh Châu", action: "đã thắp nến", time: "2 phút trước", tone: "from-amber-200 to-emerald-700" },
  { name: "Hoàng Nam", action: "đã thả hoa đăng", time: "15 phút trước", tone: "from-orange-200 to-slate-700" },
  { name: "Lan Anh", action: "đã viết lời nguyện", time: "35 phút trước", tone: "from-rose-200 to-emerald-800" },
  { name: "Giấu tên", action: "đã gửi lời nguyện", time: "1 giờ trước", tone: "from-slate-100 to-stone-600" }
];

function Avatar({ tone }: { tone: string }) {
  return <span className={`h-9 w-9 shrink-0 rounded-full border border-amber-200/30 bg-gradient-to-br ${tone}`} />;
}

export default function Home() {
  return (
    <div className="ritual-dashboard min-h-screen overflow-x-hidden bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/" variant="prayers" />

      <main className="min-h-screen px-3 py-4 sm:px-4 sm:py-6 xl:ml-72 2xl:px-8">
        <header className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl">Chào buổi tối, Minh Châu 🌺</h1>
            <p className="mt-2 text-sm text-slate-400">Hôm nay là một món quà. Hãy sống chậm lại và chọn điều tốt đẹp cho tâm hồn bạn.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm kiếm lời nguyện, thông điệp..." />
            </label>
            <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/6">
              <Bell size={18} aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">8</span>
            </button>
            <span className="h-11 w-11 rounded-full border border-amber-200/30 bg-[radial-gradient(circle_at_40%_30%,#f8d7a1,#7c4a2f_58%,#1f2937)]" />
          </div>
        </header>

        <div className="mx-auto mt-6 grid max-w-[1600px] gap-6 2xl:grid-cols-[minmax(0,1fr)_25rem]">
          <section className="grid gap-6">
            <section className="relative min-h-[25rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-5 shadow-2xl shadow-black/25 sm:min-h-[22rem] sm:p-8">
              <Image
                src="/assets/rituals/today-message-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover object-[66%_center] sm:object-right"
              />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.9),rgba(8,13,25,0.58)_48%,rgba(8,13,25,0.24)_100%)] sm:bg-[linear-gradient(90deg,rgba(8,13,25,0.9),rgba(8,13,25,0.63)_42%,rgba(8,13,25,0.08)_78%,rgba(8,13,25,0.28))]" />
              <div className="relative z-10 flex min-h-[19rem] max-w-xl flex-col justify-center sm:min-h-[17rem]">
                <p className="text-4xl leading-none text-amber-400/90 sm:text-5xl">“</p>
                <h2 className="mt-2 text-2xl font-medium leading-[1.45] text-amber-100 sm:text-3xl md:text-4xl">
                  Bình an không phải là
                  <br />
                  không có bão tố, mà là
                  <br />
                  biết cách mỉm cười giữa
                  <br />
                  những cơn mưa.
                </h2>
                <Link href="/prayers/new" className="mt-8 inline-flex w-fit max-w-full items-center gap-3 rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(251,191,36,0.18)] sm:px-6 sm:text-base">
                  <PenLine size={18} aria-hidden="true" />
                  Viết lời nguyện hôm nay
                </Link>
              </div>
              <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {[0, 1, 2, 3].map((item) => (
                  <span key={item} className={`h-2 w-2 rounded-full ${item === 0 ? "bg-amber-300" : "bg-white/30"}`} />
                ))}
              </div>
            </section>

            <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-2xl shadow-black/20 sm:grid-cols-2 sm:p-4 lg:grid-cols-3 xl:grid-cols-6">
              {shortcuts.map((item) => (
                <Link key={item.title} href={item.href} className="flex items-center gap-3 rounded-xl border border-white/7 bg-[#111a2a] px-4 py-3 transition hover:border-amber-200/30 hover:bg-white/8">
                  <RitualMiniImage src={item.image} className="h-10 w-11" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{item.title}</span>
                    <span className="block truncate text-xs text-slate-400">{item.subtitle}</span>
                  </span>
                </Link>
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 sm:p-5">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Hành trình hôm nay</h2>
                    <p className="mt-1 text-sm text-slate-400">Gợi ý dành riêng cho bạn</p>
                  </div>
                  <Link href="/gratitude" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-200">
                    Xem tất cả
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {journeys.map((item) => (
                    <article key={item.title} className="overflow-hidden rounded-xl border border-white/10 bg-[#101827]">
                      <Image src={item.image} width={420} height={260} alt="" aria-hidden="true" className="h-32 w-full object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">{item.text}</p>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="h-3 w-3 rounded-full border border-slate-500" />
                          {item.time}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 sm:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Được yêu thích</h2>
                  <Link href="/prayers" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-200">
                    Xem tất cả
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid gap-4">
                  {favorites.map((item) => (
                    <div key={item.title} className="flex items-center gap-3">
                      {item.image ? <RitualMiniImage src={item.image} className="h-7 w-8" /> : <span className="grid h-7 w-8 place-items-center text-xl">{item.icon}</span>}
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-200">{item.title}</span>
                      <Heart size={16} className="text-slate-300" aria-hidden="true" />
                      <span className="w-12 text-right text-sm text-slate-300">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 sm:p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Lời nhắc nhẹ nhàng</h2>
                  <p className="mt-1 text-sm text-slate-400">Dành cho tâm hồn bạn mỗi ngày</p>
                </div>
                <button className="grid h-9 w-9 place-items-center rounded-full bg-white/6 text-slate-300">
                  <Sparkles size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {reminders.map((item) => (
                  <article key={item.text} className="flex min-h-36 items-center gap-4 rounded-xl border border-white/10 bg-[#101827] p-4">
                    <RitualMiniImage src={item.image} className="h-14 w-16" />
                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-sm leading-6 text-slate-200">“{item.text}”</p>
                      <p className="mt-2 text-xs text-slate-400">- {item.author}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="grid min-w-0 content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Cộng đồng Bình An</h2>
                <Link href="/prayers" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-200">
                  Xem tất cả
                  <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Lời nguyện", value: "128.542", image: "/assets/rituals/lantern.png" },
                  { label: "Nến thắp", value: "86.314", image: "/assets/rituals/candle.png" },
                  { label: "Người đồng hành", value: "24.158", icon: Users }
                ].map((stat) => {
                  const Icon = "icon" in stat ? stat.icon : null;

                  return (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-[#121a2a] p-3 text-center">
                      {"image" in stat ? (
                        <RitualMiniImage src={stat.image} className="mx-auto h-8 w-9" />
                      ) : Icon ? (
                        <Icon className="mx-auto text-indigo-300" size={26} fill="currentColor" aria-hidden="true" />
                      ) : null}
                      <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">{stat.value}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mx-auto mt-7 max-w-xs text-center text-sm leading-6 text-slate-300">Cảm ơn bạn đã trở thành một phần của cộng đồng Bình An.</p>
              <Link href="/prayers/new" className="mt-5 block rounded-xl bg-gradient-to-r from-[#252525] via-[#332d25] to-[#262626] px-4 py-3 text-center font-semibold text-amber-200">
                Viết lời nguyện
              </Link>
            </section>

            <section className="relative min-h-48 overflow-hidden rounded-2xl border border-amber-200/20 p-5 sm:min-h-56 sm:p-7">
              <Image src="/assets/rituals/today-message-bg.png" width={1792} height={1024} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-right" />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.78),rgba(8,13,25,0.2),rgba(8,13,25,0.42))]" />
              <div className="relative z-10 max-w-xs">
                <p className="text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">“Ánh sáng nhỏ bé cũng có thể thắp sáng cả một bầu trời.”</p>
                <p className="mt-4 text-sm text-slate-300">- Bình An</p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Sự kiện sắp diễn ra</h2>
                <Link href="/events" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-200">
                  Xem tất cả
                  <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-5 grid gap-4">
                {events.map((event) => (
                  <div key={event.title} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
                      <CalendarDays size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{event.title}</span>
                      <span className="text-xs text-slate-400">{event.time}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Hoạt động gần đây</h2>
                <Link href="/prayers" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-200">
                  Xem tất cả
                  <ChevronRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-5 grid gap-4">
                {activities.map((activity) => (
                  <div key={activity.name} className="flex items-center gap-3">
                    <Avatar tone={activity.tone} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-slate-200">
                        <b className="font-semibold text-white">{activity.name}</b> {activity.action}
                      </span>
                      <span className="text-xs text-slate-400">{activity.time}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

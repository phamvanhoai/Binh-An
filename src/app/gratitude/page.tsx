import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronRightCircle,
  Flame,
  Gift,
  Heart,
  MoreVertical,
  Search,
  Sparkles,
  Star,
  Trophy
} from "lucide-react";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";

const stats = [
  { label: "Ngày liên tục", value: "36", icon: CalendarDays },
  { label: "Tổng điều biết ơn", value: "248", icon: Heart },
  { label: "Tuần biết ơn nhiều nhất", value: "7", icon: Star },
  { label: "Điều biết ơn tuần này", value: "18", icon: Flame },
  { label: "Thử thách hoàn thành", value: "12", icon: Gift }
];

const gratitudeEntries = [
  { text: "Biết ơn một ngày mới với nhiều cơ hội để học hỏi và trưởng thành.", time: "Hôm nay, 07:30", image: "/assets/rituals/lantern.png", filter: "hue-rotate(-28deg) saturate(1.3)" },
  { text: "Biết ơn gia đình luôn yêu thương, ủng hộ và là điểm tựa vững chắc của tôi.", time: "Hôm qua, 21:15", image: "/assets/rituals/lantern.png", filter: "hue-rotate(0deg)" },
  { text: "Biết ơn sức khỏe tốt để tôi có thể làm những điều mình yêu thích mỗi ngày.", time: "Hôm qua, 06:45", image: "/assets/rituals/lantern.png", filter: "hue-rotate(-84deg) saturate(1.4)" }
];

const prompts = [
  "Một điều khiến bạn mỉm cười hôm nay",
  "Một người đã giúp đỡ bạn",
  "Một khoảnh khắc bình yên",
  "Một điều bạn học được",
  "Một điều nhỏ bé nhưng ý nghĩa"
];

const activities = [
  { text: "Bạn đã ghi nhận 3 điều biết ơn", time: "07:30", icon: Sparkles },
  { text: "Bạn đã hoàn thành thử thách 7 ngày biết ơn", time: "Hôm qua", icon: Gift },
  { text: "Bạn đã đạt mốc 30 ngày liên tục", time: "2 ngày trước", icon: Trophy },
  { text: "Bạn đã chia sẻ 2 điều biết ơn", time: "3 ngày trước", icon: Heart }
];

const days = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  const muted = [6, 10, 20, 21, 23, 31].includes(day);
  const many = [22, 30].includes(day);
  const today = day === 10 || day === 31;
  return { day, muted, many, today };
});

export default function GratitudePage() {
  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/gratitude" variant="prayers" />

      <main className="min-h-screen px-4 py-6 xl:ml-72 2xl:px-8">
        <header className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Hành trình biết ơn</h1>
            <p className="mt-2 text-sm text-slate-400">Ghi lại những điều tốt đẹp mỗi ngày và nuôi dưỡng lòng biết ơn trong bạn.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm kiếm điều biết ơn..." />
            </label>
            <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/6">
              <Bell size={18} aria-hidden="true" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
            </button>
            <div className="h-11 w-11 rounded-full border border-amber-200/30 bg-[radial-gradient(circle_at_40%_30%,#f8d7a1,#7c4a2f_58%,#1f2937)]" />
          </div>
        </header>

        <div className="mx-auto mt-6 grid max-w-[1600px] gap-6 2xl:grid-cols-[minmax(0,1fr)_25rem]">
          <section className="grid gap-6">
            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-8 shadow-2xl shadow-black/25">
              <Image
                src="/assets/rituals/gratitude-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.88),rgba(8,13,25,0.5)_48%,rgba(8,13,25,0.18)_74%,rgba(8,13,25,0.36))]" />

              <div className="relative z-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
                <div className="max-w-lg">
                  <p className="text-5xl leading-none text-amber-300/80">“</p>
                  <h2 className="mt-3 text-3xl font-medium leading-[1.38] text-amber-100 md:text-4xl">
                    Biết ơn biến những gì ta có
                    <br />
                    thành đủ đầy.
                  </h2>
                  <p className="mt-6 max-w-md text-base leading-7 text-slate-200">Mỗi ngày, hãy ghi lại ít nhất 3 điều khiến bạn biết ơn.</p>
                  <Link href="/gratitude/new" className="mt-7 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-6 py-3 font-semibold text-white shadow-[0_20px_45px_rgba(251,191,36,0.2)]">
                    <Sparkles size={18} aria-hidden="true" />
                    Ghi lại điều biết ơn
                  </Link>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0b1220]/72 p-6 backdrop-blur">
                  <h3 className="text-center font-semibold text-white">Hành trình của bạn</h3>
                  <div className="mt-5 flex items-center gap-6">
                    <div className="relative h-24 w-24 rounded-full bg-[conic-gradient(#f6b454_0_78%,rgba(255,255,255,0.12)_78%_100%)]">
                      <span className="absolute inset-3 rounded-full bg-[#0b1220]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Ngày liên tục</p>
                      <p className="mt-2 text-4xl font-semibold text-white">36 <span className="text-xl font-normal text-slate-300">ngày</span></p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                    <div>
                      <p className="text-sm text-slate-400">Tổng điều biết ơn</p>
                      <p className="mt-1 text-2xl font-semibold text-white">248 <span className="text-sm font-normal text-slate-400">điều</span></p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Tuần này</p>
                      <p className="mt-1 text-2xl font-semibold text-white">18 <span className="text-sm font-normal text-slate-400">điều</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold text-white">Thống kê hành trình</h2>
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-4 py-2 text-xs text-slate-300">
                  30 ngày gần đây
                  <ChevronRightCircle size={14} aria-hidden="true" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-5">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#121a2a] p-4">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/8 text-amber-200">
                      <stat.icon size={22} fill="currentColor" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-2xl font-semibold text-white">{stat.value}</span>
                      <span className="text-xs text-slate-400">{stat.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="mb-5 flex items-center gap-3">
                <h2 className="font-semibold text-white">Lịch hành trình</h2>
                <div className="ml-3 flex gap-2">
                  <button className="grid h-8 w-8 place-items-center rounded-full bg-white/6 text-slate-300">
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <button className="grid h-8 w-8 place-items-center rounded-full bg-white/6 text-slate-300">
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
                <span className="text-sm text-slate-300">Tháng 5, 2024</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 md:grid-cols-10 xl:grid-cols-[repeat(16,minmax(0,1fr))]">
                {days.map((item, index) => (
                  <div key={item.day} className="grid justify-items-center gap-2">
                    <span>{["T2", "T3", "T4", "T5", "T6", "T7", "CN"][index % 7]}</span>
                    <span className={`grid h-9 w-9 place-items-center rounded-full ${item.today ? "border border-amber-300 text-amber-100" : "text-slate-300"}`}>
                      {item.day}
                    </span>
                    <RitualMiniImage
                      src="/assets/rituals/lantern.png"
                      className={`h-6 w-7 ${item.muted ? "opacity-35 grayscale" : ""} ${item.many ? "scale-125" : ""}`}
                    />
                    <span className="h-1 w-1 rounded-full bg-amber-300/80" />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-6 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-300" />Đã ghi nhận</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-400" />Đã ghi nhiều</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-600" />Chưa ghi nhận</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full border border-amber-300" />Hôm nay</span>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <h2 className="font-semibold text-white">Những điều biết ơn gần đây</h2>
              <div className="mt-4 divide-y divide-white/10 rounded-xl bg-[#121a2a] px-4">
                {gratitudeEntries.map((entry) => (
                  <div key={entry.text} className="flex items-center gap-4 py-4">
                    <RitualMiniImage src={entry.image} className="h-10 w-12" />
                    <p className="flex-1 text-sm leading-6 text-slate-200">{entry.text}</p>
                    <span className="text-xs text-slate-500">{entry.time}</span>
                    <button className="grid h-9 w-9 place-items-center rounded-full bg-white/6 text-slate-400">
                      <MoreVertical size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
              <Link href="/gratitude" className="mt-4 flex justify-center rounded-xl bg-white/6 px-4 py-4 text-sm font-semibold text-amber-200 hover:bg-white/10">
                Xem tất cả nhật ký
                <ChevronRight className="ml-2" size={16} aria-hidden="true" />
              </Link>
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Thử thách biết ơn</h2>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#121a2a] p-5">
                <div className="flex gap-4">
                  <RitualMiniImage src="/assets/rituals/lantern.png" className="h-16 w-20" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">7 ngày biết ơn</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Ghi lại 3 điều biết ơn mỗi ngày trong 7 ngày liên tục.</p>
                  </div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full w-[72%] rounded-full bg-gradient-to-r from-amber-300 to-orange-500" />
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span />
                  <span>5 / 7 ngày</span>
                </div>
                <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-5 py-3 font-semibold text-white">
                  Tiếp tục hành trình
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Gợi ý điều biết ơn</h2>
              <div className="mt-5 grid gap-4">
                {prompts.map((prompt) => (
                  <button key={prompt} className="flex items-center gap-3 text-left text-sm text-slate-300">
                    <Sparkles className="text-amber-300" size={16} aria-hidden="true" />
                    <span className="flex-1">{prompt}</span>
                    <ChevronRight size={16} className="text-slate-500" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Hoạt động gần đây</h2>
              <div className="mt-4 divide-y divide-white/10 rounded-xl bg-[#121a2a] px-4">
                {activities.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 py-3 text-sm">
                    <item.icon className="text-amber-300" size={16} aria-hidden="true" />
                    <span className="flex-1 text-slate-300">{item.text}</span>
                    <span className="text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard" className="mt-3 flex justify-center rounded-xl bg-white/6 px-4 py-3 text-sm text-slate-300 hover:text-white">
                Xem tất cả
              </Link>
            </section>

            <section className="relative min-h-56 overflow-hidden rounded-2xl border border-amber-200/20 p-7">
              <Image
                src="/assets/rituals/gratitude-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.56),rgba(15,23,42,0.18),rgba(15,23,42,0.48))]" />
              <div className="relative z-10 ml-auto max-w-xs text-right">
                <p className="text-lg leading-8 text-slate-100">“Hãy bắt đầu mỗi ngày với lòng biết ơn và kết thúc ngày với sự bình an.”</p>
                <p className="mt-5 text-sm text-slate-200">— Bình An</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

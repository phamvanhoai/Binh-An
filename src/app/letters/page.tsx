import Image from "next/image";
import Link from "next/link";
import {
  CalendarHeart,
  ChevronRight,
  Clock3,
  Gift,
  Heart,
  Mail,
  MoreVertical,
  Search,
  Star,
  TimerReset,
  Trophy
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";

const letters = [
  {
    title: "Gửi đến chính mình",
    status: "Sắp được gửi",
    statusClass: "bg-emerald-400/14 text-emerald-200",
    preview: "Có lên nhé! Dù hôm nay có khó khăn thế nào, hãy tin rằng bạn đang đi đúng hướng...",
    sentAt: "20/05/2024",
    openAt: "20/05/2025"
  },
  {
    title: "Cho một phiên bản tốt hơn của mình",
    status: "Đã lên lịch",
    statusClass: "bg-sky-400/14 text-sky-200",
    preview: "Hãy luôn nhớ lý do bạn bắt đầu. Đừng quên những ước mơ đã từng ấp ủ và những điều bạn muốn trở thành...",
    sentAt: "10/05/2024",
    openAt: "10/05/2025"
  },
  {
    title: "Những điều muốn nói với bản thân",
    status: "Sắp được gửi",
    statusClass: "bg-emerald-400/14 text-emerald-200",
    preview: "Cảm ơn bạn vì đã không bỏ cuộc. Cảm ơn bạn vì đã mạnh mẽ vượt qua tất cả những điều tưởng chừng không thể...",
    sentAt: "01/05/2024",
    openAt: "01/05/2025"
  },
  {
    title: "Lời nhắn cho tuổi 30",
    status: "Đã nhận",
    statusClass: "bg-violet-400/14 text-violet-200",
    preview: "Chúc mừng bạn! Bạn đã đi được một chặng đường dài hơn bạn nghĩ rất nhiều. Hãy tự hào về bản thân nhé!",
    sentAt: "15/05/2023",
    openAt: "15/05/2024"
  }
];

const tips = [
  { icon: Heart, text: "Viết về những điều bạn muốn nhắc nhở bản thân" },
  { icon: Star, text: "Chia sẻ ước mơ, mục tiêu và kế hoạch của bạn" },
  { icon: Trophy, text: "Động viên bản thân vượt qua khó khăn" },
  { icon: CalendarHeart, text: "Gửi lời cảm ơn đến bản thân hiện tại" },
  { icon: Gift, text: "Đừng quên lời nhắn yêu thương!" }
];

const letterTabs = [
  { label: "Thư đã gửi", icon: Mail },
  { label: "Thư đã nhận", icon: Gift },
  { label: "Bản nháp", icon: Clock3 }
];

export default function LettersPage() {
  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/letters" variant="prayers" />

      <main className="dashboard-main">
        <header className="dashboard-frame flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Gửi mình trong tương lai</h1>
            <p className="mt-2 text-sm text-slate-400">Viết một bức thư cho chính bạn trong tương lai và nhận lại vào ngày bạn chọn.</p>
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
            <section className="relative min-h-[23rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-8 shadow-2xl shadow-black/25">
              <Image
                src="/assets/rituals/future-letter-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.88),rgba(8,13,25,0.54)_48%,rgba(8,13,25,0.14)_78%,rgba(8,13,25,0.34))]" />
              <div className="relative z-10 max-w-xl">
                <p className="text-5xl leading-none text-amber-300/80">“</p>
                <h2 className="mt-4 text-3xl font-medium leading-[1.4] text-amber-100 md:text-4xl">
                  Hôm nay bạn gieo một lời nhắn,
                  <br />
                  tương lai bạn sẽ nhận một món quà
                  <br />
                  từ chính trái tim mình.
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-slate-200">Đôi khi, điều bạn cần nhất trong tương lai chính là một lời nhắc nhở từ hiện tại.</p>
                <Link href="/letters/new" className="mt-7 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-6 py-3 font-semibold text-white shadow-[0_20px_45px_rgba(251,191,36,0.2)]">
                  <Mail size={18} aria-hidden="true" />
                  Viết thư cho tương lai
                </Link>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20">
              <div className="flex border-b border-white/10 px-6 pt-5">
                {letterTabs.map((tab, index) => (
                  <button
                    key={tab.label}
                    className={`inline-flex items-center gap-2 border-b-2 px-4 pb-4 text-sm font-medium transition ${
                      index === 0 ? "border-amber-300 text-amber-200" : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    <tab.icon size={16} aria-hidden="true" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 p-4">
                {letters.map((letter) => (
                  <article key={letter.title} className="grid gap-4 rounded-xl border border-white/10 bg-[#121a2a] p-5 md:grid-cols-[4.5rem_minmax(0,1fr)_12rem_2rem] md:items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white/8 text-amber-200">
                      <Mail size={29} fill="currentColor" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold text-white">{letter.title}</h2>
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${letter.statusClass}`}>
                          <Clock3 size={12} aria-hidden="true" />
                          {letter.status}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{letter.preview}</p>
                    </div>
                    <div className="border-white/10 text-sm md:border-l md:pl-6">
                      <p className="text-slate-400">Ngày gửi</p>
                      <p className="mt-1 text-slate-200">{letter.sentAt}</p>
                      <p className="mt-3 text-slate-400">Ngày nhận</p>
                      <p className="mt-1 font-semibold text-amber-200">{letter.openAt}</p>
                    </div>
                    <button className="grid h-10 w-10 place-items-center rounded-full bg-white/6 text-slate-300">
                      <MoreVertical size={18} aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>

              <Link href="/letters" className="mx-4 mb-4 flex justify-center rounded-xl bg-white/6 px-4 py-4 text-sm font-semibold text-amber-200 hover:bg-white/10">
                Xem tất cả thư đã gửi
                <ChevronRight className="ml-2" size={16} aria-hidden="true" />
              </Link>
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="relative min-h-64 overflow-hidden rounded-2xl border border-white/10 p-6">
              <Image
                src="/assets/rituals/future-write-card.png"
                width={1024}
                height={576}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.82),rgba(15,23,42,0.48)_52%,rgba(15,23,42,0.2))]" />
              <div className="relative z-10 max-w-52">
                <h2 className="text-2xl font-semibold text-white">Viết thư mới</h2>
                <p className="mt-5 text-sm leading-6 text-slate-200">Gửi một lời nhắn yêu thương tới chính bạn trong tương lai.</p>
                <Link href="/letters/new" className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-7 py-3 font-semibold text-white">
                  Viết thư ngay
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="text-xl font-semibold text-white">Tổng quan của bạn</h2>
              <div className="mt-6 grid gap-5">
                {[
                  { icon: Mail, value: "12", label: "Thư đã gửi", color: "text-amber-300" },
                  { icon: TimerReset, value: "5", label: "Thư sắp đến ngày", color: "text-sky-300" },
                  { icon: Gift, value: "7", label: "Thư đã nhận", color: "text-rose-300" }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    <span className={`grid h-12 w-12 place-items-center rounded-full bg-white/8 ${stat.color}`}>
                      <stat.icon size={24} aria-hidden="true" />
                    </span>
                    <span className="text-2xl font-semibold text-white">{stat.value}</span>
                    <span className="text-slate-400">{stat.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="text-xl font-semibold text-white">Gợi ý khi viết thư</h2>
              <div className="mt-5 grid gap-4">
                {tips.map((tip) => (
                  <div key={tip.text} className="flex items-center gap-3 text-sm text-slate-300">
                    <tip.icon className="text-amber-300" size={17} fill="currentColor" aria-hidden="true" />
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative min-h-56 overflow-hidden rounded-2xl border border-amber-200/20 p-7">
              <Image
                src="/assets/rituals/peace-sky-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.52),rgba(15,23,42,0.16),rgba(15,23,42,0.5))]" />
              <div className="relative z-10 ml-auto max-w-xs text-right">
                <p className="text-lg leading-8 text-slate-100">“Bạn không thể quay lại quá khứ để thay đổi khởi đầu, nhưng bạn có thể bắt đầu từ hôm nay để thay đổi kết thúc.”</p>
                <p className="mt-5 text-sm text-slate-200">— Bình An</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

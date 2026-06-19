import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Flame,
  Flower2,
  Heart,
  MessageCircle,
  Search,
  Sparkles,
  Users
} from "lucide-react";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";

const prayers = [
  { name: "Minh Châu", time: "5 phút trước", image: "/assets/rituals/lantern.png", color: "hue-rotate(0deg)", text: "Cầu mong gia đình luôn mạnh khỏe, bình an và hạnh phúc.", likes: 128, comments: 24 },
  { name: "Hoàng Nam", time: "10 phút trước", image: "/assets/rituals/lantern.png", color: "hue-rotate(-28deg) saturate(1.35)", text: "Xin cho bố sớm bình phục và luôn lạc quan mỗi ngày.", likes: 97, comments: 16 },
  { name: "Lan Anh", time: "15 phút trước", image: "/assets/rituals/lantern.png", color: "hue-rotate(0deg) saturate(1.15)", text: "Mong mọi điều tốt đẹp sẽ đến với những người tôi yêu thương.", likes: 64, comments: 12 },
  { name: "Giấu tên", time: "20 phút trước", image: "/assets/rituals/lantern.png", color: "hue-rotate(-86deg) saturate(1.35)", text: "Cầu mong thế giới này luôn tràn đầy tình yêu và lòng bao dung.", likes: 58, comments: 18 },
  { name: "Thu Hà", time: "25 phút trước", image: "/assets/rituals/lantern.png", color: "hue-rotate(-28deg) saturate(1.4)", text: "Cảm ơn cuộc sống đã cho mình những người bạn tuyệt vời.", likes: 73, comments: 11 },
  { name: "An Nhiên", time: "30 phút trước", image: "/assets/rituals/lantern.png", color: "hue-rotate(170deg) saturate(1.3)", text: "Xin cho con có đủ sức mạnh để vượt qua mọi thử thách.", likes: 45, comments: 9 },
  { name: "Tuệ An", time: "35 phút trước", image: "/assets/rituals/lantern.png", color: "hue-rotate(68deg) saturate(1.25)", text: "Mong mọi sự khó khăn đều hóa giải, bình an sẽ ở lại.", likes: 39, comments: 7 },
  { name: "Giấu tên", time: "40 phút trước", image: "/assets/rituals/lantern.png", color: "hue-rotate(14deg) saturate(1.4)", text: "Cầu mong cho những ai đang đau khổ sẽ tìm thấy ánh sáng.", likes: 51, comments: 13 }
];

const topPrayers = [
  { text: "Mong cho ba mẹ luôn khỏe mạnh, bình an và hạnh phúc.", likes: "3.892", color: "hue-rotate(-28deg) saturate(1.3)" },
  { text: "Cầu mong cho các sĩ tử vượt qua kỳ thi với kết quả tốt nhất.", likes: "2.756", color: "hue-rotate(-82deg) saturate(1.35)" },
  { text: "Mong thế giới luôn hòa bình, không còn chiến tranh.", likes: "2.341", color: "hue-rotate(12deg) saturate(1.3)" }
];

const activities = [
  { text: "Bạn đã đồng nguyện 5 lời nguyện", time: "10:30", icon: Flower2 },
  { text: "Bạn đã thả 3 hoa đăng", time: "09:15", icon: Flame },
  { text: "Lời nguyện của bạn đã được 12 người đồng nguyện", time: "Hôm qua", icon: Heart },
  { text: "Bạn nhận được 8 lượt đồng nguyện", time: "Hôm qua", icon: Sparkles }
];

const filters = ["Lời nguyện", "Hoa đăng", "Cầu nguyện", "Lòng biết ơn"];

function PrayerLantern({
  className = "h-28 w-36",
  filter = "none"
}: {
  className?: string;
  filter?: string;
}) {
  return (
    <div className={`relative mx-auto ${className}`}>
      <span className="absolute inset-x-3 bottom-2 h-8 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.34),rgba(56,189,248,0.08)_48%,transparent_74%)] blur-sm" />
      <Image
        src="/assets/rituals/lantern.png"
        width={1200}
        height={800}
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.48)]"
        style={{ filter }}
      />
      <span className="absolute left-1/2 top-[40%] z-20 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/40 blur-2xl" />
      <span className="absolute left-1/2 top-[36%] z-30 h-8 w-5 -translate-x-1/2 -translate-y-1/2 rounded-[60%_40%_60%_40%] bg-gradient-to-b from-white via-amber-200 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.85)]" />
    </div>
  );
}

export default function SkyPage() {
  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/sky" variant="prayers" />

      <main className="dashboard-main">
        <header className="dashboard-frame flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Bầu trời Bình An</h1>
            <p className="mt-2 text-sm text-slate-400">Nơi những lời nguyện, yêu thương và năng lượng tích cực được lan tỏa mỗi ngày.</p>
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
            <section className="relative min-h-[25.5rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-7 shadow-2xl shadow-black/25">
              <Image
                src="/assets/rituals/peace-sky-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.82),rgba(8,13,25,0.4)_46%,rgba(8,13,25,0.08)_74%,rgba(8,13,25,0.28))]" />

              <div className="relative z-10 max-w-xl">
                <p className="text-5xl leading-none text-amber-300/80">“</p>
                <h2 className="mt-4 text-3xl font-medium leading-[1.35] text-amber-100 md:text-4xl">
                  Cùng nhau thắp sáng
                  <br />
                  Bầu trời Bình An
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-slate-200">Mỗi lời nguyện là một ánh sáng, lan tỏa yêu thương và bình an đến muôn nơi.</p>
              </div>

              <div className="absolute bottom-7 left-7 right-7 z-10 grid max-w-2xl gap-5 md:grid-cols-3">
                {[
                  { label: "Lời nguyện", value: "128.542", icon: Flower2 },
                  { label: "Hoa đăng", value: "86.314", icon: Flame },
                  { label: "Người đồng hành", value: "24.158", icon: Users }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-amber-200">
                      <stat.icon size={24} fill="currentColor" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xl font-semibold text-white">{stat.value}</span>
                      <span className="text-xs text-slate-300">{stat.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-3">
                {filters.map((filter, index) => (
                  <button
                    key={filter}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      index === 0 ? "border-amber-400 bg-amber-300/12 text-amber-100" : "border-white/10 bg-white/6 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Sparkles size={14} aria-hidden="true" />
                    {filter}
                  </button>
                ))}
              </div>
              <button className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/6 px-5 py-3 text-sm text-slate-200">
                Mới nhất
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {prayers.map((prayer, index) => (
                <article key={`${prayer.name}-${index}`} className="overflow-hidden rounded-xl border border-white/10 bg-[#121a2a] p-4 shadow-xl shadow-black/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border border-amber-200/20 bg-[radial-gradient(circle_at_40%_30%,#f8d7a1,#7c4a2f_58%,#1f2937)]" />
                    <div>
                      <p className="font-semibold text-white">{prayer.name}</p>
                      <p className="text-xs text-slate-400">{prayer.time}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.16),transparent_62%),linear-gradient(180deg,rgba(15,23,42,0.4),rgba(2,6,23,0.2))] py-3">
                    <PrayerLantern filter={prayer.color} />
                  </div>
                  <p className="mt-4 min-h-14 text-sm leading-6 text-slate-100">{prayer.text}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1 text-rose-300">
                      <Heart size={15} aria-hidden="true" />
                      {prayer.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle size={15} aria-hidden="true" />
                      {prayer.comments}
                    </span>
                    <button className="ml-auto rounded-lg bg-amber-300/12 px-3 py-2 text-amber-100">Đồng nguyện</button>
                  </div>
                </article>
              ))}
            </section>

            <button className="rounded-xl border border-white/10 bg-white/6 px-5 py-4 text-sm font-semibold text-amber-200 hover:bg-white/10">
              Xem thêm lời nguyện
              <ChevronDown className="ml-2 inline" size={16} aria-hidden="true" />
            </button>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Cộng đồng Bình An</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Lời nguyện", value: "128.542", icon: Flower2 },
                  { label: "Hoa đăng", value: "86.314", icon: Flame },
                  { label: "Người đồng hành", value: "24.158", icon: Users }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-[#121a2a] p-4 text-center">
                    <stat.icon className="mx-auto mb-2 text-amber-300" size={20} fill="currentColor" aria-hidden="true" />
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-sm leading-6 text-slate-300">Cảm ơn bạn đã trở thành một phần của cộng đồng Bình An.</p>
              <Link href="/prayers/new" className="mt-4 flex justify-center rounded-xl bg-amber-300/12 px-4 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-300/18">
                Viết lời nguyện
              </Link>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Lời nguyện được đồng nguyện nhiều nhất</h2>
              <div className="mt-5 grid gap-3">
                {topPrayers.map((item) => (
                  <article key={item.text} className="flex gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <RitualMiniImage src="/assets/rituals/lantern.png" className="mt-1 h-10 w-11" />
                    <div>
                      <p className="text-sm leading-6 text-slate-100">{item.text}</p>
                      <p className="mt-2 text-xs text-slate-500">♥ {item.likes} người đồng nguyện</p>
                    </div>
                    <Heart className="ml-auto shrink-0 text-rose-400" size={18} aria-hidden="true" />
                  </article>
                ))}
              </div>
              <Link href="/prayers" className="mt-4 flex justify-center rounded-xl bg-white/6 px-4 py-3 text-sm text-slate-300 hover:text-white">
                Xem tất cả
              </Link>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Hoạt động nổi bật</h2>
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

            <section className="relative min-h-56 overflow-hidden rounded-2xl border border-amber-200/20 p-7">
              <Image
                src="/assets/rituals/peace-sky-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.58),rgba(15,23,42,0.16),rgba(15,23,42,0.42))]" />
              <div className="relative z-10 ml-auto max-w-xs text-right">
                <p className="text-lg leading-8 text-slate-100">“Mỗi ánh sáng nhỏ đều có thể thắp sáng cả một bầu trời.”</p>
                <p className="mt-5 text-sm text-slate-200">— Bình An</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

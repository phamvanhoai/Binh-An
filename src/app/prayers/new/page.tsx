import Link from "next/link";
import {
  Bell,
  BookOpen,
  CalendarHeart,
  Crown,
  Flame,
  Flower2,
  Heart,
  Home,
  Mail,
  MoonStar,
  Search,
  Settings,
  Sparkles,
  Users
} from "lucide-react";
import { CandlePrayerMockupForm } from "@/components/forms/CandlePrayerMockupForm";

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/today", label: "Thông điệp hôm nay", icon: Sparkles },
  { href: "/prayers/new", label: "Thắp nến & Lời nguyện", icon: Flame, active: true },
  { href: "/sky", label: "Bầu trời bình an", icon: MoonStar },
  { href: "/letters", label: "Gửi mình trong tương lai", icon: CalendarHeart },
  { href: "/memorials", label: "Góc tưởng nhớ", icon: Mail },
  { href: "/gratitude", label: "Hành trình biết ơn", icon: BookOpen },
  { href: "/prayers", label: "Bạn bè & Đồng nguyện", icon: Users }
];

const stats = [
  { label: "Nến hôm nay", value: "12.458", icon: Flame },
  { label: "Lời nguyện", value: "3.245", icon: BookOpen },
  { label: "Người tham gia", value: "8.932", icon: Users }
];

const topPrayers = [
  "Mong ba vượt qua ca phẫu thuật, mọi chuyện bình an.",
  "Cầu mong cho các sĩ tử thi tốt, đạt được ước mơ.",
  "Mong dịch bệnh qua đi, mọi người được khỏe mạnh."
];

const recentPrayers = [
  "Mong mẹ luôn khỏe mạnh và vui vẻ mỗi ngày.",
  "Cầu mong gia đình bình an, hạnh phúc.",
  "Hy vọng mọi điều tốt đẹp sẽ đến với mình.",
  "Cảm ơn vì hôm nay mọi thứ đều ổn.",
  "Cầu mong thế giới luôn hòa bình."
];

export default function NewPrayerPage() {
  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <aside className="ritual-sidebar fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#0b1222]/95 px-4 py-6 xl:block">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-amber-200">
            <Flower2 size={30} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-2xl font-semibold tracking-normal text-white">Bình An</span>
            <span className="text-sm text-slate-400">Nơi gửi những điều tốt đẹp</span>
          </span>
        </Link>

        <nav className="mt-10 grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                item.active ? "bg-white/10 text-white shadow-[0_0_30px_rgba(251,191,36,0.12)]" : "text-slate-300 hover:bg-white/6 hover:text-white"
              }`}
            >
              <item.icon size={18} className={item.active ? "text-amber-300" : "text-slate-400"} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 overflow-hidden rounded-xl border border-amber-200/20 bg-[radial-gradient(circle_at_70%_20%,rgba(251,191,36,0.22),transparent_9rem),linear-gradient(135deg,rgba(30,41,59,0.86),rgba(15,23,42,0.94))] p-5">
          <Flame className="mb-4 text-amber-300" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Gửi bình an</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Đến những người bạn yêu thương bằng một lời nguyện nhỏ.</p>
          <button className="mt-5 w-full rounded-lg bg-white/12 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/18">
            Tìm hiểu thêm
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-5">
          <Crown className="mb-4 text-amber-300" aria-hidden="true" />
          <h2 className="font-semibold">Nâng cấp Premium</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Mở khóa tính năng nâng cao và trải nghiệm không quảng cáo.</p>
          <button className="mt-5 w-full rounded-lg bg-amber-400/20 px-4 py-3 text-sm font-semibold text-amber-100">
            Nâng cấp ngay
          </button>
        </div>

        <div className="mt-6 grid gap-3 text-sm text-slate-400">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 hover:text-white">
            <Settings size={17} aria-hidden="true" />
            Cài đặt
          </Link>
        </div>
      </aside>

      <main className="min-h-screen px-4 py-6 xl:ml-72 2xl:px-8">
        <header className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Thắp nến / hương & hoa đăng</h1>
            <p className="mt-2 text-sm text-slate-400">Gửi gắm lời nguyện, lan tỏa năng lượng bình an đến muôn nơi</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm kiếm lời nguyện, người dùng..." />
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
            <CandlePrayerMockupForm />

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-white">Lời nguyện gần đây</h2>
                <Link href="/prayers" className="text-sm text-slate-400 hover:text-white">
                  Xem tất cả
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {recentPrayers.map((prayer, index) => (
                  <article key={prayer} className="rounded-xl border border-white/10 bg-[#121a2a] p-4">
                    <Flame className="mb-3 text-amber-300" size={18} aria-hidden="true" />
                    <p className="min-h-16 text-sm leading-6 text-slate-200">{prayer}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>{index + 2} phút trước</span>
                      <span className="inline-flex items-center gap-1 text-rose-400">
                        <Heart size={13} aria-hidden="true" />
                        {126 - index * 14}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Cộng đồng đang thắp nến</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-[#121a2a] p-4 text-center">
                    <stat.icon className="mx-auto mb-2 text-amber-300" size={20} aria-hidden="true" />
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Lời nguyện được đồng nguyện nhiều nhất</h2>
              <div className="mt-5 grid gap-3">
                {topPrayers.map((prayer, index) => (
                  <article key={prayer} className="flex gap-4 rounded-xl border border-white/10 bg-[#121a2a] p-4">
                    <Flame className="mt-1 shrink-0 text-amber-300" size={23} aria-hidden="true" />
                    <div>
                      <p className="text-sm leading-6 text-slate-100">{prayer}</p>
                      <p className="mt-2 text-xs text-slate-500">{2351 - index * 364} người đồng nguyện</p>
                    </div>
                    <Heart className="ml-auto shrink-0 text-rose-400" size={18} aria-hidden="true" />
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Hoạt động của bạn</h2>
              <div className="mt-4 divide-y divide-white/10 rounded-xl bg-[#121a2a] px-4">
                {["Bạn đã thắp 27 ngọn nến", "Bạn nhận được 156 lượt đồng nguyện", "Bạn đã thả 12 hoa đăng", "Bạn có 3 thư sẽ được mở"].map((item) => (
                  <p key={item} className="py-3 text-sm text-slate-300">
                    {item}
                  </p>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-amber-200/20 bg-[radial-gradient(circle_at_18%_50%,rgba(251,191,36,0.22),transparent_8rem),linear-gradient(135deg,#17213a,#0f172a)] p-7">
              <p className="text-lg leading-8 text-slate-100">“Khi bạn thắp sáng cho người khác, ánh sáng cũng sẽ soi rọi chính bạn.”</p>
              <p className="mt-4 text-sm text-slate-400">— Bình An</p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

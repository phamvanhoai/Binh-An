"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  Heart,
  Search,
  Users
} from "lucide-react";
import { CandlePrayerMockupForm } from "@/components/forms/CandlePrayerMockupForm";
import type { RitualMode } from "@/components/forms/CandlePrayerMockupForm";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";

const topPrayers = [
  { text: "Mong ba vượt qua ca phẫu thuật, mọi chuyện bình an.", mode: "candle" as const },
  { text: "Cầu mong cho các sĩ tử thi tốt, đạt được ước mơ.", mode: "incense" as const },
  { text: "Mong dịch bệnh qua đi, mọi người được khỏe mạnh.", mode: "lantern" as const }
];

const ritualVisuals = {
  candle: {
    image: "/assets/rituals/candle.png",
    miniClass: "h-9 w-9",
    statClass: "h-8 w-8",
    communityTitle: "Cộng đồng đang thắp nến",
    statLabel: "Nến hôm nay"
  },
  incense: {
    image: "/assets/rituals/incense.png",
    miniClass: "h-11 w-9",
    statClass: "h-9 w-8",
    communityTitle: "Cộng đồng đang thắp hương",
    statLabel: "Nén hương hôm nay"
  },
  lantern: {
    image: "/assets/rituals/lantern.png",
    miniClass: "h-9 w-11",
    statClass: "h-8 w-10",
    communityTitle: "Cộng đồng đang thả hoa đăng",
    statLabel: "Hoa đăng hôm nay"
  }
} satisfies Record<RitualMode, {
  image: string;
  miniClass: string;
  statClass: string;
  communityTitle: string;
  statLabel: string;
}>;

const recentPrayers = [
  { text: "Mong mẹ luôn khỏe mạnh và vui vẻ mỗi ngày.", mode: "candle" as const },
  { text: "Cầu mong gia đình bình an, hạnh phúc.", mode: "incense" as const },
  { text: "Hy vọng mọi điều tốt đẹp sẽ đến với mình.", mode: "lantern" as const },
  { text: "Cảm ơn vì hôm nay mọi thứ đều ổn.", mode: "candle" as const },
  { text: "Cầu mong thế giới luôn hòa bình.", mode: "lantern" as const }
];

export default function NewPrayerPage() {
  const [selectedMode, setSelectedMode] = useState<RitualMode>("candle");
  const ritualVisual = ritualVisuals[selectedMode];
  const stats = [
    { label: ritualVisual.statLabel, value: "12.458", image: ritualVisual.image },
    { label: "Lời nguyện", value: "3.245", icon: BookOpen },
    { label: "Người tham gia", value: "8.932", icon: Users }
  ];

  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/prayers/new" variant="prayers" />

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
            <CandlePrayerMockupForm mode={selectedMode} onModeChange={setSelectedMode} />

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-white">Lời nguyện gần đây</h2>
                <Link href="/prayers" className="text-sm text-slate-400 hover:text-white">
                  Xem tất cả
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {recentPrayers.map((prayer, index) => {
                  const prayerVisual = ritualVisuals[prayer.mode];

                  return (
                    <article key={prayer.text} className="rounded-xl border border-white/10 bg-[#121a2a] p-4">
                    <RitualMiniImage src={prayerVisual.image} className={`mb-3 ${prayerVisual.statClass}`} />
                    <p className="min-h-16 text-sm leading-6 text-slate-200">{prayer.text}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>{index + 2} phút trước</span>
                      <span className="inline-flex items-center gap-1 text-rose-400">
                        <Heart size={13} aria-hidden="true" />
                        {126 - index * 14}
                      </span>
                    </div>
                  </article>
                  );
                })}
              </div>
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">{ritualVisual.communityTitle}</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-[#121a2a] p-4 text-center">
                    {"image" in stat ? (
                      <RitualMiniImage src={stat.image} className={`mx-auto mb-2 ${ritualVisual.statClass}`} />
                    ) : (
                      <stat.icon className="mx-auto mb-2 text-amber-300" size={20} aria-hidden="true" />
                    )}
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Lời nguyện được đồng nguyện nhiều nhất</h2>
              <div className="mt-5 grid gap-3">
                {topPrayers.map((prayer, index) => {
                  const prayerVisual = ritualVisuals[prayer.mode];

                  return (
                  <article key={prayer.text} className="flex gap-4 rounded-xl border border-white/10 bg-[#121a2a] p-4">
                    <RitualMiniImage src={prayerVisual.image} className={`mt-1 ${prayerVisual.miniClass}`} />
                    <div>
                      <p className="text-sm leading-6 text-slate-100">{prayer.text}</p>
                      <p className="mt-2 text-xs text-slate-500">{2351 - index * 364} người đồng nguyện</p>
                    </div>
                    <Heart className="ml-auto shrink-0 text-rose-400" size={18} aria-hidden="true" />
                  </article>
                  );
                })}
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

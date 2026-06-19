import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Flame,
  Heart,
  Mail,
  MessageCircle,
  MoreVertical,
  Search,
  Sparkles,
  Users
} from "lucide-react";
import { DashboardSidebar, RitualMiniImage } from "@/components/layout/DashboardSidebar";

const memories = [
  { name: "Mẹ yêu", years: "1958 - 2022", image: "/assets/rituals/lantern.png", filter: "hue-rotate(0deg)", text: "Cảm ơn mẹ vì tất cả yêu thương vô điều kiện. Mẹ luôn trong tim con.", hearts: 128, comments: 24 },
  { name: "Ngoại", years: "1935 - 2020", image: "/assets/rituals/lantern.png", filter: "hue-rotate(0deg) saturate(1.1)", text: "Ngoại ơi, con nhớ những chiều ngoại kể chuyện bên hiên nhà.", hearts: 97, comments: 16 },
  { name: "Ba", years: "1955 - 2019", image: "/assets/rituals/lantern.png", filter: "hue-rotate(-8deg) saturate(0.86) brightness(1.1)", text: "Ba là tấm gương lớn nhất của cuộc đời con.", hearts: 156, comments: 28 },
  { name: "Bạn thân - Minh", years: "1990 - 2018", image: "/assets/rituals/candle.png", filter: "hue-rotate(-12deg) saturate(1.05)", text: "Cảm ơn vì những năm tháng thanh xuân rực rỡ bên nhau.", hearts: 85, comments: 12 },
  { name: "Cô giáo Lan", years: "1960 - 2021", image: "/assets/rituals/candle.png", filter: "hue-rotate(8deg) saturate(1.05)", text: "Cảm ơn cô đã dạy con bằng cả trái tim.", hearts: 64, comments: 9 },
  { name: "Chú Hai", years: "1948 - 2017", image: "/assets/rituals/lantern.png", filter: "hue-rotate(0deg)", text: "Chú luôn là người che chở và yêu thương gia đình.", hearts: 51, comments: 8 },
  { name: "Ông nội", years: "1930 - 2015", image: "/assets/rituals/candle.png", filter: "hue-rotate(0deg)", text: "Những lời dạy của ông con luôn khắc ghi.", hearts: 73, comments: 11 }
];

const favoriteMemories = [
  { text: "Mẹ là ánh sáng dịu dàng soi bước đời con.", likes: "2.458", image: "/assets/rituals/lantern.png" },
  { text: "Cảm ơn ba, người hùng thầm lặng của gia đình.", likes: "1.987", image: "/assets/rituals/candle.png" },
  { text: "Bạn luôn trong tim tôi, những kỷ niệm đẹp mãi còn đây.", likes: "1.756", image: "/assets/rituals/lantern.png" }
];

const activities = [
  { text: "Bạn đã thắp nến tưởng nhớ Mẹ yêu", time: "10:30", icon: Flame },
  { text: "Bạn đã viết lời tưởng nhớ mới", time: "09:15", icon: Mail },
  { text: "Bạn đã thắp nến tưởng nhớ Ba", time: "Hôm qua", icon: Sparkles },
  { text: "Bạn gửi lời tưởng nhớ đến Cô giáo Lan", time: "Hôm qua", icon: Heart },
  { text: "Bạn đã tạo kỷ niệm mới", time: "2 ngày trước", icon: Mail }
];

const filters = ["Tất cả", "Gia đình", "Bạn bè", "Thầy cô", "Người đã khuất", "Kỷ niệm"];

function MemoryImage({ src, filter }: { src: string; filter: string }) {
  return (
    <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-amber-200/15 bg-[#0b1220]">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.2),transparent_65%)]" />
      <Image
        src={src}
        width={300}
        height={300}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover p-2 drop-shadow-[0_0_22px_rgba(251,191,36,0.4)]"
        style={{ filter }}
      />
    </div>
  );
}

export default function MemorialsPage() {
  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/memorials" variant="prayers" />

      <main className="min-h-screen px-4 py-6 xl:ml-72 2xl:px-8">
        <header className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Góc tưởng nhớ</h1>
            <p className="mt-2 text-sm text-slate-400">Nơi bạn thắp nến, gửi lời tri ân và giữ những kỷ niệm đẹp trong tim.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden min-w-80 items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400 lg:flex">
              <Search size={18} aria-hidden="true" />
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Tìm kiếm tên, lời tưởng nhớ..." />
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
            <section className="relative min-h-[21rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1525] p-8 shadow-2xl shadow-black/25">
              <Image
                src="/assets/rituals/memorial-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,25,0.88),rgba(8,13,25,0.52)_48%,rgba(8,13,25,0.16)_78%,rgba(8,13,25,0.34))]" />
              <div className="relative z-10 max-w-lg">
                <p className="text-5xl leading-none text-amber-300/80">“</p>
                <h2 className="mt-3 text-3xl font-medium leading-[1.38] text-amber-100 md:text-4xl">
                  Ký ức là ngọn đèn
                  <br />
                  soi sáng yêu thương,
                  <br />
                  dẫn lối trái tim ta
                  <br />
                  về những điều đẹp đẽ.
                </h2>
                <Link href="/memorials/new" className="mt-7 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#8b5d1d] via-[#b87928] to-[#d69a3a] px-6 py-3 font-semibold text-white shadow-[0_20px_45px_rgba(251,191,36,0.2)]">
                  <Flame size={18} aria-hidden="true" />
                  Thắp nến tưởng nhớ
                </Link>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-3">
                  {filters.map((filter, index) => (
                    <button
                      key={filter}
                      className={`border-b-2 px-4 pb-3 text-sm font-medium transition ${
                        index === 0 ? "border-amber-300 text-amber-200" : "border-transparent text-slate-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <button className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/6 px-5 py-3 text-sm text-slate-200">
                  Mới nhất
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {memories.map((memory) => (
                  <article key={memory.name} className="relative rounded-xl border border-white/10 bg-[#121a2a] p-4 text-center">
                    <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/6 text-slate-400">
                      <MoreVertical size={16} aria-hidden="true" />
                    </button>
                    <MemoryImage src={memory.image} filter={memory.filter} />
                    <h2 className="mt-4 font-semibold text-white">{memory.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">{memory.years}</p>
                    <p className="mt-4 min-h-16 text-sm leading-6 text-slate-300">{memory.text}</p>
                    <div className="mt-4 flex items-center justify-center gap-7 text-sm text-slate-400">
                      <span className="inline-flex items-center gap-1 text-rose-300">
                        <Heart size={15} aria-hidden="true" />
                        {memory.hearts}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle size={15} aria-hidden="true" />
                        {memory.comments}
                      </span>
                    </div>
                    <button className="mt-4 w-full rounded-lg bg-white/6 px-4 py-3 text-sm font-semibold text-amber-200 hover:bg-white/10">
                      Thắp nến
                    </button>
                  </article>
                ))}

                <article className="rounded-xl border border-white/10 bg-[#121a2a] p-4 text-center">
                  <span className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-white/8 text-amber-200">
                    <Flame size={38} fill="currentColor" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 font-semibold text-amber-100">Thêm kỷ niệm</h2>
                  <p className="mt-4 min-h-16 text-sm leading-6 text-slate-400">Tạo kỷ niệm mới, viết lời tưởng nhớ và thắp nến tri ân.</p>
                  <Link href="/memorials/new" className="mt-4 flex w-full justify-center rounded-lg bg-white/6 px-4 py-3 text-sm font-semibold text-amber-200 hover:bg-white/10">
                    Tạo ngay
                  </Link>
                </article>
              </div>

              <button className="mt-4 w-full rounded-xl border border-white/10 bg-white/6 px-5 py-4 text-sm font-semibold text-amber-200 hover:bg-white/10">
                Xem thêm
                <ChevronDown className="ml-2 inline" size={16} aria-hidden="true" />
              </button>
            </section>
          </section>

          <aside className="grid content-start gap-5">
            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Lời tưởng nhớ đã gửi</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Nến nến", value: "1.248", icon: Flame },
                  { label: "Lời tưởng nhớ", value: "856", icon: Mail },
                  { label: "Người nhận", value: "482", icon: Users }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-[#121a2a] p-4 text-center">
                    <stat.icon className="mx-auto mb-2 text-amber-300" size={20} fill="currentColor" aria-hidden="true" />
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-6">
              <div className="flex items-center gap-5">
                <RitualMiniImage src="/assets/rituals/lantern.png" className="h-12 w-14" />
                <p className="text-base leading-7 text-slate-100">“Tưởng nhớ không phải để giữ người ở lại, mà là để giữ yêu thương luôn ở đó.”</p>
              </div>
              <p className="mt-3 text-right text-sm text-slate-300">— Bình An</p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <h2 className="font-semibold text-white">Lời tưởng nhớ được yêu thích</h2>
              <div className="mt-5 grid gap-3">
                {favoriteMemories.map((item) => (
                  <article key={item.text} className="grid grid-cols-[4.6rem_minmax(0,1fr)] gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <div className="relative h-16 overflow-hidden rounded-lg bg-[#0b1220]">
                      <Image src={item.image} width={180} height={180} alt="" aria-hidden="true" className="h-full w-full object-cover p-1" />
                    </div>
                    <div>
                      <p className="text-sm leading-6 text-slate-100">“{item.text}”</p>
                      <p className="mt-2 flex items-center justify-end gap-1 text-xs text-slate-400">
                        <Heart size={13} className="fill-rose-400 text-rose-400" aria-hidden="true" />
                        {item.likes}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <Link href="/memorials" className="mt-4 flex justify-center rounded-xl bg-white/6 px-4 py-3 text-sm text-slate-300 hover:text-white">
                Xem tất cả
              </Link>
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

            <section className="relative min-h-48 overflow-hidden rounded-2xl border border-amber-200/20 p-7">
              <Image
                src="/assets/rituals/memorial-bg.png"
                width={1792}
                height={1024}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.62),rgba(15,23,42,0.18),rgba(15,23,42,0.54))]" />
              <div className="relative z-10 ml-auto max-w-xs text-right">
                <p className="text-lg leading-8 text-slate-100">“Yêu thương không bao giờ mất đi, nó chỉ chuyển thành ký ức để luôn ở bên ta.”</p>
                <p className="mt-5 text-sm text-slate-200">— Bình An</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

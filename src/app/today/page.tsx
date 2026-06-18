import Link from "next/link";
import Image from "next/image";
import {
  Bell,
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
import { demoMessages } from "@/lib/demo-data";

type DailyMessage = {
  message: string;
  reflection_question?: string | null;
  category?: string | null;
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

const recentMessages = [
  { text: "Bạn không cần hoàn hảo để bắt đầu, nhưng hãy bắt đầu để trở nên tốt hơn.", date: "14/05/2024" },
  { text: "Đừng nhất thiết phải điểm hoàn hảo, hãy tự tạo ra thời điểm hoàn hảo của riêng bạn.", date: "13/05/2024" },
  { text: "Những điều tốt đẹp luôn đến với những người biết kiên nhẫn và không ngừng cố gắng.", date: "12/05/2024" },
  { text: "Hạnh phúc không phải là đích đến, mà là hành trình tận hưởng mọi khoảnh khắc.", date: "11/05/2024" },
  { text: "Bạn có sức mạnh để thay đổi cuộc sống của mình vào bất kỳ lúc nào.", date: "10/05/2024" }
];

const activities = [
  { text: "Bạn đã xem thông điệp hôm nay", time: "07:30", icon: Leaf },
  { text: "Bạn đã thắp 1 nến", time: "07:28", icon: Flame },
  { text: "Bạn đã gửi lời nguyện", time: "07:25", icon: Send },
  { text: "Bạn nhận được 5 lượt đồng nguyện", time: "07:20", icon: Heart }
];

async function getTodayMessage(): Promise<DailyMessage> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/daily-message/today`, {
      cache: "no-store"
    });
    if (!response.ok) return demoMessages[0];
    const json = await response.json();
    return json.data || demoMessages[0];
  } catch {
    return demoMessages[0];
  }
}

export default async function TodayPage() {
  const message = await getTodayMessage();
  const heroMessage = "Bình yên không phải là nơi ta đến, mà là cách ta chọn để sống mỗi ngày.";
  const heroReflection = message.reflection_question || "Hãy hít thở sâu, mỉm cười và biết ơn những điều đang có trong hiện tại.";

  return (
    <div className="ritual-dashboard min-h-screen bg-[#080d19] text-slate-100">
      <DashboardSidebar activeHref="/today" variant="today" />

      <main className="min-h-screen px-4 py-6 xl:ml-72 2xl:px-8">
        <header className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Thông điệp hôm nay</h1>
            <p className="mt-2 text-sm text-slate-400">Mỗi ngày một thông điệp để nuôi dưỡng tâm hồn và lan tỏa năng lượng tích cực.</p>
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
                <p className="mt-3 text-sm text-slate-300">Thứ Tư, 15 tháng 5, 2024</p>
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
                    <article key={item.date} className="rounded-xl border border-white/10 bg-[#121a2a] p-4">
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
              <Link href="/dashboard" className="mt-3 flex justify-center rounded-xl bg-white/6 px-4 py-3 text-sm text-slate-300 hover:text-white">
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

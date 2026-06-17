import Link from "next/link";
import { BookHeart, CalendarHeart, Flame, HeartHandshake, Mail, MoonStar } from "lucide-react";
import { PrayerCard } from "@/components/cards/PrayerCard";
import { demoPrayers } from "@/lib/demo-data";

const features = [
  { icon: MoonStar, title: "Thông điệp hôm nay", text: "Mỗi ngày một thông điệp nhỏ để chậm lại." },
  { icon: Flame, title: "Thắp nến bình an", text: "Gửi lời nguyện riêng tư hoặc công khai ẩn danh." },
  { icon: HeartHandshake, title: "Đồng nguyện", text: "Nhận sự nâng đỡ nhẹ nhàng từ cộng đồng văn minh." },
  { icon: Mail, title: "Thư tương lai", text: "Viết cho chính mình và mở vào một ngày đã hẹn." },
  { icon: BookHeart, title: "Góc tưởng nhớ", text: "Lưu giữ ký ức về người thân trong không gian riêng." },
  { icon: CalendarHeart, title: "Hành trình biết ơn", text: "Ghi lại những điều tốt đẹp theo ngày tháng." }
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-night text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.24),transparent_32rem),radial-gradient(circle_at_80%_10%,rgba(167,243,208,0.16),transparent_28rem)]" />
        <div className="relative mx-auto grid min-h-[74vh] max-w-7xl content-center gap-10 px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded bg-white/10 px-3 py-1 text-sm font-semibold text-mint">
              Mỗi ngày một phút bình an
            </p>
            <h1 className="text-5xl font-bold tracking-normal sm:text-7xl">Bình An</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Nơi gửi lời nguyện, lưu giữ ký ức và nhận một thông điệp tích cực mỗi ngày.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="rounded bg-candle px-5 py-3 font-semibold text-night transition hover:bg-amber-300">
                Bắt đầu ngay
              </Link>
              <Link href="/today" className="rounded border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                Mở thông điệp
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {demoPrayers.map((prayer) => (
              <div key={prayer.id} className="rounded-lg border border-white/10 bg-white/8 p-4 text-sm text-slate-200">
                {prayer.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold text-night">Không gian nhẹ nhàng cho những điều tốt đẹp</h2>
          <p className="mt-3 text-slate-600">MVP gồm đầy đủ các luồng cốt lõi để web và app mobile dùng chung backend.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="soft-panel rounded-lg p-5">
              <feature.icon className="mb-4 text-night" size={24} aria-hidden="true" />
              <h3 className="font-semibold text-night">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-night">Lời nguyện mới nhất</h2>
              <p className="mt-2 text-slate-600">Công khai ẩn danh, không bình luận tự do.</p>
            </div>
            <Link href="/prayers/new" className="rounded bg-night px-4 py-3 text-center font-semibold text-white">
              Tạo lời nguyện
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {demoPrayers.map((prayer) => (
              <PrayerCard key={prayer.id} id={prayer.id} content={prayer.content} type={prayer.type} counts={prayer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

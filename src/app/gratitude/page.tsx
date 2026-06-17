import Link from "next/link";
import { CalendarHeart } from "lucide-react";

export default function GratitudePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-night">Hành trình biết ơn</h1>
          <p className="mt-2 text-slate-600">Ghi lại những điều tốt đẹp theo ngày tháng.</p>
        </div>
        <Link href="/gratitude/new" className="rounded bg-night px-4 py-3 text-center font-semibold text-white">
          Ghi điều biết ơn
        </Link>
      </div>
      <div className="soft-panel rounded-lg p-8 text-center">
        <CalendarHeart className="mx-auto text-night" size={36} aria-hidden="true" />
        <p className="mt-4 font-semibold text-night">Timeline đang sẵn sàng cho dữ liệu của bạn.</p>
        <p className="mt-2 text-slate-600">Dùng query month/year với API để lọc theo tháng.</p>
      </div>
    </section>
  );
}

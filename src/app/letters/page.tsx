import Link from "next/link";
import { Mail } from "lucide-react";

export default function LettersPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-night">Thư tương lai</h1>
          <p className="mt-2 text-slate-600">Những lá thư chỉ mở khi đến ngày hẹn.</p>
        </div>
        <Link href="/letters/new" className="rounded bg-night px-4 py-3 text-center font-semibold text-white">
          Viết thư
        </Link>
      </div>
      <div className="soft-panel rounded-lg p-8 text-center">
        <Mail className="mx-auto text-night" size={36} aria-hidden="true" />
        <p className="mt-4 font-semibold text-night">Chưa có thư nào trong bản demo.</p>
        <p className="mt-2 text-slate-600">Kết nối Supabase và đăng nhập để xem danh sách thư của riêng bạn.</p>
      </div>
    </section>
  );
}

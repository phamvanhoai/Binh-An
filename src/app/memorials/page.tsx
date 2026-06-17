import Link from "next/link";
import { BookHeart } from "lucide-react";

export default function MemorialsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-night">Góc tưởng nhớ</h1>
          <p className="mt-2 text-slate-600">Lưu giữ ký ức và thắp một ngọn nến nhỏ.</p>
        </div>
        <Link href="/memorials/new" className="rounded bg-night px-4 py-3 text-center font-semibold text-white">
          Tạo góc tưởng nhớ
        </Link>
      </div>
      <div className="soft-panel rounded-lg p-8 text-center">
        <BookHeart className="mx-auto text-night" size={36} aria-hidden="true" />
        <p className="mt-4 font-semibold text-night">Chưa có hồ sơ tưởng nhớ trong bản demo.</p>
        <p className="mt-2 text-slate-600">Sau khi kết nối Supabase, trang này sẽ hiển thị memorial của user.</p>
      </div>
    </section>
  );
}

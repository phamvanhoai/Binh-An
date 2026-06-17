import Link from "next/link";
import { BookHeart } from "lucide-react";

export default function MemorialsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-night">Goc tuong nho</h1>
          <p className="mt-2 text-slate-600">Luu giu ky uc va thap mot ngon nen nho.</p>
        </div>
        <Link href="/memorials/new" className="rounded bg-night px-4 py-3 text-center font-semibold text-white">
          Tao goc tuong nho
        </Link>
      </div>
      <div className="soft-panel rounded-lg p-8 text-center">
        <BookHeart className="mx-auto text-night" size={36} aria-hidden="true" />
        <p className="mt-4 font-semibold text-night">Chua co ho so tuong nho trong ban demo.</p>
        <p className="mt-2 text-slate-600">Sau khi ket noi Supabase, trang nay se hien thi memorial cua user.</p>
      </div>
    </section>
  );
}

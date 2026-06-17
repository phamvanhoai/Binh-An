import { Flame } from "lucide-react";

export default async function MemorialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="soft-panel rounded-lg p-6">
        <p className="text-sm font-semibold text-slate-500">Memorial #{id}</p>
        <h1 className="mt-3 text-3xl font-bold text-night">Góc tưởng nhớ</h1>
        <p className="mt-4 text-slate-600">Trang chi tiết sẽ hiển thị ảnh, lời nhắn, nến và kỷ niệm khi có dữ liệu thật.</p>
        <form className="mt-6" action={`/api/memorials/${id}/candles`} method="post">
          <button className="inline-flex items-center gap-2 rounded bg-night px-4 py-3 font-semibold text-white">
            <Flame size={17} aria-hidden="true" />
            Thắp nến
          </button>
        </form>
      </article>
    </section>
  );
}

export default async function LetterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="soft-panel rounded-lg p-6">
        <p className="text-sm font-semibold text-slate-500">Thư #{id}</p>
        <h1 className="mt-3 text-3xl font-bold text-night">Lá thư đang khóa</h1>
        <p className="mt-4 text-slate-600">API sẽ chỉ trả nội dung khi đến ngày mở thư và user là chủ sở hữu.</p>
      </article>
    </section>
  );
}

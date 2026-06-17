export default async function LetterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="soft-panel rounded-lg p-6">
        <p className="text-sm font-semibold text-slate-500">Thu #{id}</p>
        <h1 className="mt-3 text-3xl font-bold text-night">La thu dang khoa</h1>
        <p className="mt-4 text-slate-600">API se chi tra noi dung khi den ngay mo thu va user la chu so huu.</p>
      </article>
    </section>
  );
}

import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { dbQuery } from "@/lib/db";

export default async function AdminReportsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const status = ["pending", "resolved", "dismissed"].includes(params.status || "") ? params.status! : "";
  const result = await dbQuery<{
    id: string;
    reason: string;
    status: string;
    target_type: string;
    target_id: string;
    created_at: string;
    target_content: string | null;
  }>(`
    select r.id, r.reason, coalesce(r.status, 'pending') as status, r.target_type, r.target_id, r.created_at,
      case when r.target_type = 'prayer' then p.content else null end as target_content
    from public.reports r
    left join public.prayers p on r.target_type = 'prayer' and p.id = r.target_id
    where ($1 = '' or r.reason ilike '%' || $1 || '%' or p.content ilike '%' || $1 || '%')
      and ($2 = '' or r.status = $2)
    order by case when r.status = 'pending' then 0 else 1 end, r.created_at desc
  `, [query, status]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Báo cáo vi phạm</h1>
        <p className="mt-2 text-sm text-slate-500">Xem lý do báo cáo và đánh dấu kết quả xử lý.</p>
      </header>
      <form className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
        <input name="q" defaultValue={query} placeholder="Tìm lý do hoặc nội dung..." className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
        <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600">
          <option value="">Mọi trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="resolved">Đã xử lý</option>
          <option value="dismissed">Đã bỏ qua</option>
        </select>
        <button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Lọc</button>
      </form>
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {result.rows.length ? (
          <div className="divide-y divide-slate-100">
            {result.rows.map((item) => (
              <article key={item.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_10rem_15rem] lg:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.reason}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.target_content || `${item.target_type}: ${item.target_id}`}</p>
                </div>
                <span className={`w-fit rounded px-2 py-1 text-xs font-medium ${item.status === "pending" ? "bg-amber-50 text-amber-700" : item.status === "resolved" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.status}</span>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <AdminActionButton endpoint={`/api/admin/reports/${item.id}`} body={{ status: "resolved" }} tone="success">Đã xử lý</AdminActionButton>
                  <AdminActionButton endpoint={`/api/admin/reports/${item.id}`} body={{ status: "dismissed" }}>Bỏ qua</AdminActionButton>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-10 text-center text-sm text-slate-500">Chưa có báo cáo nào.</p>
        )}
      </section>
    </div>
  );
}

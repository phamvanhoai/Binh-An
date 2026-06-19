import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { dbQuery } from "@/lib/db";

export default async function AdminReportsPage() {
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
    order by case when r.status = 'pending' then 0 else 1 end, r.created_at desc
  `);

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Báo cáo vi phạm</h1>
        <p className="mt-2 text-sm text-slate-500">Xem lý do báo cáo và đánh dấu kết quả xử lý.</p>
      </header>
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

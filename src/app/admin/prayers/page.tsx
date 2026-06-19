import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { dbQuery } from "@/lib/db";

export default async function AdminPrayersPage() {
  const result = await dbQuery<{
    id: string;
    content: string;
    type: string;
    visibility: string;
    status: string;
    created_at: string;
    reactions: string;
  }>(`
    select p.id, p.content, p.type, p.visibility, coalesce(p.status, 'active') as status, p.created_at,
      count(r.id)::text as reactions
    from public.prayers p
    left join public.prayer_reactions r on r.prayer_id = p.id
    group by p.id
    order by p.created_at desc
    limit 200
  `);

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Kiểm duyệt lời bình an</h1>
        <p className="mt-2 text-sm text-slate-500">Ẩn nội dung vi phạm hoặc khôi phục nội dung phù hợp.</p>
      </header>
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {result.rows.map((item) => (
            <article key={item.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_10rem_15rem] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">{item.type}</span>
                  <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">{item.visibility}</span>
                  <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">{item.reactions} phản hồi</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-800">{item.content}</p>
              </div>
              <span className={`w-fit rounded px-2 py-1 text-xs font-medium ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : item.status === "hidden" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{item.status}</span>
              <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                {item.status !== "active" ? <AdminActionButton endpoint={`/api/admin/prayers/${item.id}`} body={{ status: "active" }} tone="success">Khôi phục</AdminActionButton> : null}
                {item.status !== "hidden" ? <AdminActionButton endpoint={`/api/admin/prayers/${item.id}`} body={{ status: "hidden" }}>Ẩn</AdminActionButton> : null}
                {item.status !== "deleted" ? <AdminActionButton endpoint={`/api/admin/prayers/${item.id}`} body={{ status: "deleted" }} tone="danger" confirmText="Đánh dấu lời bình an này là đã xóa?">Xóa</AdminActionButton> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

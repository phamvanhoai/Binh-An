import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { dbQuery } from "@/lib/db";

const pageSize = 20;

export default async function AdminPrayersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const status = ["active", "hidden", "deleted"].includes(params.status || "") ? params.status! : "";
  const type = ["wish", "gratitude", "memorial", "worry", "peace"].includes(params.type || "") ? params.type! : "";
  const page = Math.max(1, Number(params.page || 1) || 1);
  const countResult = await dbQuery<{ count: string }>(`
    select count(*)::text as count
    from public.prayers p
    where ($1 = '' or p.content ilike '%' || $1 || '%')
      and ($2 = '' or p.status = $2)
      and ($3 = '' or p.type = $3)
  `, [query, status, type]);
  const totalPages = Math.max(1, Math.ceil(Number(countResult.rows[0]?.count || 0) / pageSize));
  const currentPage = Math.min(page, totalPages);
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
    where ($1 = '' or p.content ilike '%' || $1 || '%')
      and ($2 = '' or p.status = $2)
      and ($3 = '' or p.type = $3)
    group by p.id
    order by p.created_at desc
    limit $4 offset $5
  `, [query, status, type, pageSize, (currentPage - 1) * pageSize]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Kiểm duyệt lời bình an</h1>
        <p className="mt-2 text-sm text-slate-500">Ẩn nội dung vi phạm hoặc khôi phục nội dung phù hợp.</p>
      </header>
      <form className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_12rem_12rem_auto]">
        <input name="q" defaultValue={query} placeholder="Tìm trong nội dung..." className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
        <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600">
          <option value="">Mọi trạng thái</option>
          <option value="active">Đang hiển thị</option>
          <option value="hidden">Đã ẩn</option>
          <option value="deleted">Đã xóa</option>
        </select>
        <select name="type" defaultValue={type} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600">
          <option value="">Mọi loại</option>
          <option value="peace">Bình an</option>
          <option value="wish">Ước nguyện</option>
          <option value="gratitude">Biết ơn</option>
          <option value="memorial">Tưởng nhớ</option>
          <option value="worry">Lo âu</option>
        </select>
        <button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Lọc</button>
      </form>
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
          {!result.rows.length ? <p className="p-10 text-center text-sm text-slate-500">Không tìm thấy lời bình an phù hợp.</p> : null}
        </div>
        <AdminPagination page={currentPage} totalPages={totalPages} params={{ q: query, status, type }} />
      </section>
    </div>
  );
}

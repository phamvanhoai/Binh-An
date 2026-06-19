import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { DailyMessageForm } from "@/components/admin/DailyMessageForm";
import { DailyMessageEditor } from "@/components/admin/DailyMessageEditor";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { dbQuery } from "@/lib/db";

const pageSize = 20;

export default async function AdminMessagesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const status = ["active", "inactive"].includes(params.status || "") ? params.status! : "";
  const page = Math.max(1, Number(params.page || 1) || 1);
  const countResult = await dbQuery<{ count: string }>(`
    select count(*)::text as count
    from public.daily_messages
    where ($1 = '' or message ilike '%' || $1 || '%' or coalesce(reflection_question, '') ilike '%' || $1 || '%')
      and ($2 = '' or ($2 = 'active' and is_active = true) or ($2 = 'inactive' and is_active = false))
  `, [query, status]);
  const totalPages = Math.max(1, Math.ceil(Number(countResult.rows[0]?.count || 0) / pageSize));
  const currentPage = Math.min(page, totalPages);
  const result = await dbQuery<{
    id: string;
    message: string;
    reflection_question: string | null;
    category: string;
    active_date: string | null;
    is_active: boolean;
    created_at: string;
  }>(`
    select
      id,
      message,
      reflection_question,
      category,
      active_date::text as active_date,
      is_active,
      created_at
    from public.daily_messages
    where ($1 = '' or message ilike '%' || $1 || '%' or coalesce(reflection_question, '') ilike '%' || $1 || '%')
      and ($2 = '' or ($2 = 'active' and is_active = true) or ($2 = 'inactive' and is_active = false))
    order by active_date desc nulls last, created_at desc
    limit $3 offset $4
  `, [query, status, pageSize, (currentPage - 1) * pageSize]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Thông điệp hằng ngày</h1>
        <p className="mt-2 text-sm text-slate-500">Tạo lịch thông điệp và bật hoặc tắt nội dung đang sử dụng.</p>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <DailyMessageForm />
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <form className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_11rem_auto]">
            <input name="q" defaultValue={query} placeholder="Tìm thông điệp..." className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
            <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600">
              <option value="">Mọi trạng thái</option>
              <option value="active">Đang bật</option>
              <option value="inactive">Đã tắt</option>
            </select>
            <button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Lọc</button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Thông điệp</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Bật/tắt</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.rows.map((item) => (
                  <tr key={item.id}>
                    <td className="max-w-xl px-4 py-4">
                      <p className="line-clamp-2 font-medium text-slate-800">{item.message}</p>
                      {item.reflection_question ? <p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.reflection_question}</p> : null}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.category}</td>
                    <td className="px-4 py-4 text-slate-600">{item.active_date ? new Intl.DateTimeFormat("vi-VN").format(new Date(item.active_date)) : "Dự phòng"}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded px-2 py-1 text-xs font-medium ${item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.is_active ? "Đang bật" : "Đã tắt"}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <AdminActionButton endpoint={`/api/admin/messages/${item.id}`} body={{ is_active: !item.is_active }} tone={item.is_active ? "danger" : "success"}>
                        {item.is_active ? "Tắt" : "Bật"}
                      </AdminActionButton>
                    </td>
                    <td className="px-4 py-4">
                      <DailyMessageEditor
                        id={item.id}
                        message={item.message}
                        reflectionQuestion={item.reflection_question || ""}
                        category={item.category}
                        activeDate={item.active_date ? item.active_date.slice(0, 10) : ""}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!result.rows.length ? <p className="p-10 text-center text-sm text-slate-500">Không tìm thấy thông điệp phù hợp.</p> : null}
          <AdminPagination page={currentPage} totalPages={totalPages} params={{ q: query, status }} />
        </section>
      </div>
    </div>
  );
}

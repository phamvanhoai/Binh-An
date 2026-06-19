import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { DailyMessageForm } from "@/components/admin/DailyMessageForm";
import { dbQuery } from "@/lib/db";

export default async function AdminMessagesPage() {
  const result = await dbQuery<{
    id: string;
    message: string;
    reflection_question: string | null;
    category: string;
    active_date: string | null;
    is_active: boolean;
    created_at: string;
  }>("select * from public.daily_messages order by active_date desc nulls last, created_at desc");

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Thông điệp hằng ngày</h1>
        <p className="mt-2 text-sm text-slate-500">Tạo lịch thông điệp và bật hoặc tắt nội dung đang sử dụng.</p>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <DailyMessageForm />
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Thông điệp</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3">Trạng thái</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

import { Activity, FileWarning, Heart, MessageSquareText, Users } from "lucide-react";
import { dbQuery } from "@/lib/db";

async function getDashboardData() {
  const result = await dbQuery<{
    users: string;
    prayers: string;
    reactions: string;
    messages: string;
    pending_reports: string;
  }>(`
    select
      (select count(*) from auth.users)::text as users,
      (select count(*) from public.prayers where status <> 'deleted')::text as prayers,
      (select count(*) from public.prayer_reactions)::text as reactions,
      (select count(*) from public.daily_messages)::text as messages,
      (select count(*) from public.reports where status = 'pending')::text as pending_reports
  `);

  const recent = await dbQuery<{ id: string; content: string; type: string; status: string; created_at: string }>(`
    select id, content, type, coalesce(status, 'active') as status, created_at
    from public.prayers
    order by created_at desc
    limit 6
  `);

  return { stats: result.rows[0], recent: recent.rows };
}

export default async function AdminPage() {
  const { stats, recent } = await getDashboardData();
  const cards = [
    { label: "Người dùng", value: stats.users, icon: Users },
    { label: "Lời bình an", value: stats.prayers, icon: Heart },
    { label: "Lượt đồng nguyện", value: stats.reactions, icon: Activity },
    { label: "Thông điệp", value: stats.messages, icon: MessageSquareText },
    { label: "Báo cáo chờ xử lý", value: stats.pending_reports, icon: FileWarning }
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <p className="text-sm font-medium text-amber-700">Bảng điều khiển</p>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Tổng quan hệ thống</h1>
        <p className="mt-2 text-sm text-slate-500">Theo dõi dữ liệu và các nội dung cần xử lý.</p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <card.icon size={22} className="text-amber-700" aria-hidden="true" />
            <p className="mt-4 text-3xl font-semibold">{Number(card.value || 0).toLocaleString("vi-VN")}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold">Lời bình an mới nhất</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recent.map((item) => (
            <div key={item.id} className="grid gap-2 px-5 py-4 md:grid-cols-[minmax(0,1fr)_8rem_8rem] md:items-center">
              <p className="line-clamp-2 text-sm leading-6 text-slate-700">{item.content}</p>
              <span className="text-xs font-medium uppercase text-slate-500">{item.type}</span>
              <span className={`w-fit rounded px-2 py-1 text-xs font-medium ${item.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

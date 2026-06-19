import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { dbQuery } from "@/lib/db";
import { requireAdminPage } from "@/lib/admin";

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const currentUser = await requireAdminPage();
  const params = await searchParams;
  const query = (params.q || "").trim();
  const role = ["admin", "user"].includes(params.role || "") ? params.role! : "";
  const result = await dbQuery<{
    id: string;
    email: string | null;
    created_at: string;
    last_sign_in_at: string | null;
    display_name: string | null;
    is_admin: boolean;
  }>(`
    select u.id, u.email, u.created_at, u.last_sign_in_at, p.display_name,
      exists(select 1 from public.admin_users a where a.user_id = u.id) as is_admin
    from auth.users u
    left join public.profiles p on p.id = u.id
    where ($1 = '' or coalesce(u.email, '') ilike '%' || $1 || '%' or coalesce(p.display_name, '') ilike '%' || $1 || '%')
      and (
        $2 = ''
        or ($2 = 'admin' and exists(select 1 from public.admin_users a where a.user_id = u.id))
        or ($2 = 'user' and not exists(select 1 from public.admin_users a where a.user_id = u.id))
      )
    order by u.created_at desc
  `, [query, role]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Người dùng</h1>
        <p className="mt-2 text-sm text-slate-500">Theo dõi tài khoản và phân quyền quản trị.</p>
      </header>
      <form className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
        <input name="q" defaultValue={query} placeholder="Tìm tên hoặc email..." className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
        <select name="role" defaultValue={role} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600">
          <option value="">Mọi quyền</option>
          <option value="admin">Admin</option>
          <option value="user">Người dùng</option>
        </select>
        <button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Lọc</button>
      </form>
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Người dùng</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Đăng nhập gần nhất</th>
                <th className="px-4 py-3">Quyền</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.rows.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">{user.display_name || "Chưa đặt tên"}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{new Intl.DateTimeFormat("vi-VN").format(new Date(user.created_at))}</td>
                  <td className="px-4 py-4 text-slate-600">{user.last_sign_in_at ? new Intl.DateTimeFormat("vi-VN").format(new Date(user.last_sign_in_at)) : "Chưa đăng nhập"}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded px-2 py-1 text-xs font-medium ${user.is_admin ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"}`}>{user.is_admin ? "Admin" : "Người dùng"}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {user.id === currentUser.id ? (
                      <span className="text-xs text-slate-400">Tài khoản hiện tại</span>
                    ) : (
                      <AdminActionButton endpoint={`/api/admin/users/${user.id}`} body={{ admin: !user.is_admin }} tone={user.is_admin ? "danger" : "success"} confirmText={user.is_admin ? "Gỡ quyền admin của tài khoản này?" : "Cấp quyền admin cho tài khoản này?"}>
                        {user.is_admin ? "Gỡ admin" : "Cấp admin"}
                      </AdminActionButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

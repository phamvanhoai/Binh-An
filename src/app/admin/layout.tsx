import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdminPage } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <AdminSidebar />
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:ml-64 lg:px-8">{children}</main>
    </div>
  );
}

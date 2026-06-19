import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Cấu hình hệ thống</h1>
        <p className="mt-2 text-sm text-slate-500">Điều chỉnh cách website tiếp nhận người dùng và hiển thị nội dung cộng đồng.</p>
      </header>
      <div className="mt-6">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}

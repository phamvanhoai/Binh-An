"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(formData: FormData) {
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allow_registration: formData.get("allow_registration") === "on",
        public_community_enabled: formData.get("public_community_enabled") === "on",
        moderate_new_prayers: formData.get("moderate_new_prayers") === "on",
        community_page_size: Number(formData.get("community_page_size")),
        support_email: String(formData.get("support_email") || "")
      })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Không thể lưu cấu hình.");
      return;
    }

    setMessage("Đã lưu cấu hình hệ thống.");
  }

  const toggles = [
    {
      name: "allow_registration",
      defaultChecked: settings.allowRegistration,
      title: "Cho phép đăng ký tài khoản",
      description: "Tắt tùy chọn này để khóa cả đăng ký email và Google trên giao diện."
    },
    {
      name: "public_community_enabled",
      defaultChecked: settings.publicCommunityEnabled,
      title: "Bật cộng đồng công khai",
      description: "Khi tắt, lời bình an mới chỉ được lưu riêng tư và API cộng đồng không trả nội dung."
    },
    {
      name: "moderate_new_prayers",
      defaultChecked: settings.moderateNewPrayers,
      title: "Duyệt lời bình an trước khi hiển thị",
      description: "Lời bình an công khai mới sẽ ở trạng thái ẩn cho đến khi admin phê duyệt."
    }
  ];

  return (
    <form action={save} className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold">Quyền truy cập</h2>
        <div className="mt-5 divide-y divide-slate-100">
          {toggles.map((item) => (
            <label key={item.name} className="flex cursor-pointer items-start justify-between gap-5 py-4 first:pt-0 last:pb-0">
              <span>
                <span className="block text-sm font-medium text-slate-900">{item.title}</span>
                <span className="mt-1 block max-w-2xl text-sm leading-6 text-slate-500">{item.description}</span>
              </span>
              <input name={item.name} type="checkbox" defaultChecked={item.defaultChecked} className="mt-1 h-5 w-5 shrink-0 accent-slate-950" />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-semibold">Hiển thị và liên hệ</h2>
        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Số lời bình an mỗi trang
          <input name="community_page_size" type="number" min={4} max={30} defaultValue={settings.communityPageSize} className="max-w-40 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-amber-600" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Email hỗ trợ
          <input name="support_email" type="email" defaultValue={settings.supportEmail} placeholder="support@example.com" className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-amber-600" />
        </label>
      </section>

      {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <button disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
        <Save size={17} aria-hidden="true" />
        {loading ? "Đang lưu..." : "Lưu cấu hình"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { ExternalLink, Save } from "lucide-react";
import type { ApiSettings } from "@/lib/site-settings";

export function ApiSettingsForm({
  settings,
  baseUrl
}: {
  settings: ApiSettings;
  baseUrl: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(formData: FormData) {
    setLoading(true);
    setMessage(null);
    setError(null);

    const origins = String(formData.get("allowed_origins") || "")
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

    const response = await fetch("/api/admin/settings/api", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_enabled: formData.get("api_enabled") === "on",
        api_maintenance: formData.get("api_maintenance") === "on",
        api_maintenance_message: String(formData.get("api_maintenance_message") || ""),
        api_allowed_origins: origins.length ? origins : ["*"],
        api_rate_limit_per_minute: Number(formData.get("api_rate_limit_per_minute"))
      })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Không thể lưu cấu hình API.");
      return;
    }
    setMessage("Đã lưu cấu hình API.");
  }

  return (
    <form action={save} className="mt-8 grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Cấu hình API cho app</h2>
        <p className="mt-2 text-sm text-slate-500">Kiểm soát truy cập vào toàn bộ endpoint `/api/v1`.</p>
      </div>

      <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <a href={`${baseUrl}/api/v1`} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
          <span className="text-xs font-medium uppercase text-slate-500">Base URL</span>
          <span className="mt-2 flex items-center gap-2 break-all text-sm font-semibold text-slate-900">
            {baseUrl}/api/v1
            <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
          </span>
        </a>
        <a href={`${baseUrl}/api/v1/openapi`} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
          <span className="text-xs font-medium uppercase text-slate-500">OpenAPI JSON</span>
          <span className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            Mở tài liệu máy đọc
            <ExternalLink size={14} aria-hidden="true" />
          </span>
        </a>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="divide-y divide-slate-100">
          <label className="flex cursor-pointer items-start justify-between gap-5 pb-4">
            <span>
              <span className="block text-sm font-medium text-slate-900">Bật API v1</span>
              <span className="mt-1 block text-sm leading-6 text-slate-500">Khi tắt, mọi endpoint app bị khóa, trừ `/config` và `/openapi`.</span>
            </span>
            <input name="api_enabled" type="checkbox" defaultChecked={settings.enabled} className="mt-1 h-5 w-5 accent-slate-950" />
          </label>
          <label className="flex cursor-pointer items-start justify-between gap-5 pt-4">
            <span>
              <span className="block text-sm font-medium text-slate-900">Chế độ bảo trì API</span>
              <span className="mt-1 block text-sm leading-6 text-slate-500">Trả mã `503` cho app trong thời gian nâng cấp hệ thống.</span>
            </span>
            <input name="api_maintenance" type="checkbox" defaultChecked={settings.maintenance} className="mt-1 h-5 w-5 accent-slate-950" />
          </label>
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Thông báo bảo trì
          <input name="api_maintenance_message" maxLength={300} defaultValue={settings.maintenanceMessage} className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-amber-600" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Giới hạn request mỗi phút
          <input name="api_rate_limit_per_minute" type="number" min={10} max={5000} defaultValue={settings.rateLimitPerMinute} className="max-w-48 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-amber-600" />
          <span className="text-xs font-normal text-slate-500">Tính theo địa chỉ IP. App vượt giới hạn nhận mã `429`.</span>
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-800">
          CORS origins được phép
          <textarea name="allowed_origins" rows={5} defaultValue={settings.allowedOrigins.join("\n")} className="rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-amber-600" />
          <span className="text-xs font-normal text-slate-500">Mỗi origin một dòng. Dùng `*` cho app native hoặc cho phép mọi origin.</span>
        </label>
      </section>

      {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <button disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
        <Save size={17} aria-hidden="true" />
        {loading ? "Đang lưu..." : "Lưu cấu hình API"}
      </button>
    </form>
  );
}

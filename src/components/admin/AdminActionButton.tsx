"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminActionButton({
  endpoint,
  body,
  children,
  tone = "default",
  confirmText
}: {
  endpoint: string;
  body: Record<string, unknown>;
  children: React.ReactNode;
  tone?: "default" | "danger" | "success";
  confirmText?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function act() {
    if (confirmText && !window.confirm(confirmText)) return;
    setLoading(true);
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setLoading(false);
    if (response.ok) router.refresh();
  }

  const tones = {
    default: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
  };

  return (
    <button type="button" disabled={loading} onClick={act} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${tones[tone]}`}>
      {loading ? "Đang xử lý..." : children}
    </button>
  );
}

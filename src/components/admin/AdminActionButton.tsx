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
  const [error, setError] = useState<string | null>(null);

  async function act() {
    if (confirmText && !window.confirm(confirmText)) return;
    setLoading(true);
    setError(null);
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    setLoading(false);
    if (response.ok) {
      router.refresh();
      return;
    }
    setError(result.error || "Không thể thực hiện thao tác.");
  }

  const tones = {
    default: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
  };

  return (
    <>
      <button type="button" disabled={loading} onClick={act} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${tones[tone]}`}>
        {loading ? "Đang xử lý..." : children}
      </button>
      {error ? (
        <button type="button" onClick={() => setError(null)} className="fixed bottom-5 right-5 z-[100] max-w-sm rounded-lg border border-rose-200 bg-white px-4 py-3 text-left text-sm text-rose-700 shadow-xl">
          {error}
        </button>
      ) : null}
    </>
  );
}

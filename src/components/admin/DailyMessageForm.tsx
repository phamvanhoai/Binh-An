"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function DailyMessageForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: formData.get("message"),
        reflection_question: formData.get("reflection_question"),
        category: formData.get("category"),
        active_date: formData.get("active_date") || null
      })
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.error || "Không thể tạo thông điệp.");
      return;
    }
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-semibold">Thêm thông điệp</h2>
        <p className="mt-1 text-sm text-slate-500">Ngày kích hoạt có thể để trống để dùng làm thông điệp dự phòng.</p>
      </div>
      <textarea name="message" required maxLength={1000} rows={3} placeholder="Nội dung thông điệp" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
      <input name="reflection_question" maxLength={500} placeholder="Câu hỏi suy ngẫm" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="category" required maxLength={50} placeholder="Danh mục, ví dụ: peace" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
        <input name="active_date" type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
      </div>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <button disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        <Plus size={17} aria-hidden="true" />
        {loading ? "Đang thêm..." : "Thêm thông điệp"}
      </button>
    </form>
  );
}

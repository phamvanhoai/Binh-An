"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";

type DailyMessageEditorProps = {
  id: string;
  message: string;
  reflectionQuestion: string;
  category: string;
  activeDate: string;
};

export function DailyMessageEditor({
  id,
  message,
  reflectionQuestion,
  category,
  activeDate
}: DailyMessageEditorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(formData: FormData) {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: formData.get("message"),
        reflection_question: formData.get("reflection_question") || null,
        category: formData.get("category"),
        active_date: formData.get("active_date") || null
      })
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.error || "Không thể cập nhật thông điệp.");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Xóa vĩnh viễn thông điệp này?")) return;
    setLoading(true);
    const response = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setLoading(false);
    if (response.ok) router.refresh();
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" title="Chỉnh sửa">
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={remove} disabled={loading} className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50" title="Xóa">
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 p-4" role="dialog" aria-modal="true">
          <form action={save} className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chỉnh sửa thông điệp</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Đóng">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              <textarea name="message" required maxLength={1000} rows={4} defaultValue={message} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
              <input name="reflection_question" maxLength={500} defaultValue={reflectionQuestion} placeholder="Câu hỏi suy ngẫm" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="category" required maxLength={50} defaultValue={category} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
                <input name="active_date" type="date" defaultValue={activeDate} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-600" />
              </div>
              {error ? <p className="text-sm text-rose-700">{error}</p> : null}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Hủy</button>
                <button disabled={loading} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

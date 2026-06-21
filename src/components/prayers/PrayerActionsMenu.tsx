"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Eye, Flag, MoreHorizontal, Send, X } from "lucide-react";

const reportReasons = [
  "Nội dung xúc phạm hoặc thù ghét",
  "Nội dung nguy hiểm hoặc cổ xúy tự hại",
  "Lừa đảo, quảng cáo hoặc spam",
  "Nội dung không phù hợp khác"
];

export function PrayerActionsMenu({ prayerId, canReport }: { prayerId: string; canReport: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState(reportReasons[0]);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setReportOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function submitReport() {
    setSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_type: "prayer",
        target_id: prayerId,
        reason
      })
    });
    const result = await response.json().catch(() => null);

    if (response.status === 401) {
      window.location.href = `/login?next=${encodeURIComponent("/prayers")}`;
      return;
    }

    setSubmitting(false);
    if (!response.ok) {
      setMessage(result?.error || "Không thể gửi báo cáo. Vui lòng thử lại.");
      return;
    }

    setMessage("Báo cáo đã được gửi để quản trị viên xem xét.");
  }

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-label="Mở menu lời bình an"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/6 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <MoreHorizontal size={17} aria-hidden="true" />
        </button>

        {open ? (
          <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-lg border border-white/10 bg-[#111b2c] p-1.5 shadow-2xl shadow-black/50">
            <Link
              href={`/prayers/${prayerId}`}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-200 hover:bg-white/8"
            >
              <Eye size={16} aria-hidden="true" />
              Xem chi tiết
            </Link>
            {canReport ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setReportOpen(true);
                  setMessage(null);
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-rose-200 hover:bg-rose-400/10"
              >
                <Flag size={16} aria-hidden="true" />
                Báo cáo nội dung
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {reportOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`report-title-${prayerId}`}
          className="fixed inset-0 z-[70] grid place-items-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setReportOpen(false);
          }}
        >
          <section className="w-full max-w-md rounded-xl border border-white/10 bg-[#0d1727] p-5 shadow-2xl shadow-black/60">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 id={`report-title-${prayerId}`} className="font-semibold text-white">
                  Báo cáo lời bình an
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">Chọn lý do phù hợp nhất. Báo cáo sẽ được quản trị viên xem xét.</p>
              </div>
              <button
                type="button"
                aria-label="Đóng báo cáo"
                onClick={() => setReportOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white/8 hover:text-white"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </header>

            <div className="mt-5 grid gap-2">
              {reportReasons.map((item) => (
                <label key={item} className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-slate-200 hover:bg-white/6">
                  <input
                    type="radio"
                    name={`report-reason-${prayerId}`}
                    value={item}
                    checked={reason === item}
                    onChange={() => {
                      setReason(item);
                      setMessage(null);
                    }}
                    className="mt-0.5 accent-amber-400"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {message ? (
              <p className={`mt-4 rounded-lg px-3 py-2.5 text-sm ${message.startsWith("Báo cáo đã") ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"}`}>
                {message}
              </p>
            ) : null}

            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setReportOpen(false)} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/6">
                Đóng
              </button>
              <button
                type="button"
                disabled={submitting || message?.startsWith("Báo cáo đã")}
                onClick={submitReport}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-500/85 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
              >
                <Send size={16} aria-hidden="true" />
                {submitting ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

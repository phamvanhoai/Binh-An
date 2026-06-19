"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const email = String(formData.get("email") || "").trim();
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSentEmail(email);
  }

  if (sentEmail) {
    return (
      <section className="w-full rounded-2xl border border-white/10 bg-[#0d1727]/80 px-5 py-8 text-center shadow-[0_32px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-9 sm:py-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
          <Mail size={30} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-white">Kiểm tra email của bạn</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Liên kết đặt lại mật khẩu đã được gửi đến <strong className="text-white">{sentEmail}</strong>.
        </p>
        <p className="mt-2 text-sm text-slate-500">Nếu chưa thấy email, hãy kiểm tra thư rác.</p>
        <button type="button" onClick={() => setSentEmail(null)} className="mt-6 text-sm font-semibold text-amber-200 hover:text-amber-100">
          Gửi lại bằng email khác
        </button>
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-[#0d1727]/80 px-5 py-8 shadow-[0_32px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-9 sm:py-10">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-200">
          <Mail size={30} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-white sm:text-3xl">Quên mật khẩu?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Nhập email tài khoản để nhận liên kết đặt lại mật khẩu.</p>
      </div>

      <form action={onSubmit} className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-white">
          Email
          <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3.5 focus-within:border-amber-300/60">
            <Mail size={19} className="text-amber-200" aria-hidden="true" />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
              placeholder="email@example.com"
            />
          </span>
        </label>

        {error ? <p className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a46d24] via-[#c58a35] to-[#a66f27] px-5 py-3.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          <Send size={18} aria-hidden="true" />
          {loading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
        </button>
      </form>

      <Link href="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-300 hover:text-amber-200">
        <ArrowLeft size={17} aria-hidden="true" />
        Quay lại đăng nhập
      </Link>
    </section>
  );
}

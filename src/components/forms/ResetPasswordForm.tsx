"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, LockKeyhole, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const password = String(formData.get("password") || "");
    const confirmation = String(formData.get("confirmation") || "");

    if (password !== confirmation) {
      setLoading(false);
      setMessage("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      setLoading(false);
      setMessage("Liên kết khôi phục không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/login?reset=success");
    router.refresh();
  }

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-[#0d1727]/80 px-5 py-8 shadow-[0_32px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-9 sm:py-10">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-200">
          <LockKeyhole size={30} aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-white sm:text-3xl">Đặt mật khẩu mới</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Mật khẩu mới cần có ít nhất 8 ký tự.</p>
      </div>

      <form action={onSubmit} className="mt-8 grid gap-5">
        {[
          { name: "password", label: "Mật khẩu mới" },
          { name: "confirmation", label: "Xác nhận mật khẩu" }
        ].map((field) => (
          <label key={field.name} className="grid gap-2 text-sm font-medium text-white">
            {field.label}
            <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3.5 focus-within:border-amber-300/60">
              <LockKeyhole size={19} className="text-amber-200" aria-hidden="true" />
              <input
                name={field.name}
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
                placeholder="Ít nhất 8 ký tự"
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-white">
                <Eye size={19} aria-hidden="true" />
                <span className="sr-only">Hiện hoặc ẩn mật khẩu</span>
              </button>
            </span>
          </label>
        ))}

        {message ? <p className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a46d24] via-[#c58a35] to-[#a66f27] px-5 py-3.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          <Save size={18} aria-hidden="true" />
          {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>
      </form>

      <Link href="/forgot-password" className="mt-6 block text-center text-sm font-semibold text-slate-400 hover:text-amber-200">
        Yêu cầu liên kết mới
      </Link>
    </section>
  );
}

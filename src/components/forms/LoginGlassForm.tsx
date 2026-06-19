"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, LockKeyhole, LogIn, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { RitualMiniImage } from "@/components/layout/DashboardSidebar";

export function LoginGlassForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const supabase = createClient();
    const result = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d1727]/76 px-5 py-7 shadow-[0_32px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-10">
      <div className="text-center">
        <RitualMiniImage src="/assets/rituals/lantern.png" className="mx-auto h-12 w-12 sm:h-14 sm:w-14" />
        <h1 className="mt-6 text-2xl font-semibold tracking-normal text-white sm:text-3xl">Chào mừng trở lại!</h1>
        <p className="mt-2 text-sm text-slate-400 sm:text-base">Đăng nhập để tiếp tục hành trình bình an.</p>
      </div>

      <form action={onSubmit} className="mt-8 grid gap-5">
        <label className="grid gap-2.5 text-sm font-medium text-white sm:text-base">
          Email hoặc số điện thoại
          <span className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3.5 text-slate-300 transition focus-within:border-amber-300/60">
            <UserRound size={19} className="text-amber-100" aria-hidden="true" />
            <input
              name="email"
              type="email"
              required
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-white outline-none placeholder:text-slate-500"
              placeholder="Nhập email hoặc số điện thoại"
            />
          </span>
        </label>

        <label className="grid gap-2.5 text-sm font-medium text-white sm:text-base">
          Mật khẩu
          <span className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3.5 text-slate-300 transition focus-within:border-amber-300/60">
            <LockKeyhole size={19} className="text-amber-100" aria-hidden="true" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-white outline-none placeholder:text-slate-500"
              placeholder="Nhập mật khẩu"
            />
            <button type="button" className="text-slate-400 transition hover:text-white" onClick={() => setShowPassword((value) => !value)}>
              <Eye size={20} aria-hidden="true" />
              <span className="sr-only">Hiện hoặc ẩn mật khẩu</span>
            </button>
          </span>
        </label>

        <Link href="/forgot-password" className="-mt-3 justify-self-end text-sm font-medium text-amber-300 hover:text-amber-200">
          Quên mật khẩu?
        </Link>

        {message ? <p className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#a46d24] via-[#c58a35] to-[#a66f27] px-6 py-3.5 text-base font-semibold text-white shadow-[0_24px_60px_rgba(251,191,36,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
        >
          <LogIn size={19} aria-hidden="true" />
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <div className="mt-7 flex items-center gap-5 text-sm text-slate-400">
        <span className="h-px flex-1 bg-white/14" />
        hoặc
        <span className="h-px flex-1 bg-white/14" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-base font-bold text-blue-500">G</span>
          Đăng nhập với Google
        </button>
        <button className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#1877f2] text-base font-bold text-white">f</span>
          Đăng nhập với Facebook
        </button>
      </div>

      <p className="mt-7 text-center text-sm text-slate-300 sm:text-base">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-semibold text-amber-300 hover:text-amber-200">
          Đăng ký ngay
        </Link>
      </p>
    </section>
  );
}

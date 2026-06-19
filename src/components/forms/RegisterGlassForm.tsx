"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, LockKeyhole, Mail, Phone, UserPlus, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function RegisterGlassForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function signUpWithGoogle() {
    setGoogleLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`
      }
    });

    if (error) {
      setGoogleLoading(false);
      setMessage(error.message);
    }
  }

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setLoading(false);
      setMessage("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    const supabase = createClient();
    const result = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <section className="rounded-3xl border border-amber-200/20 bg-[#071326]/78 px-5 py-6 shadow-[0_32px_100px_rgba(0,0,0,0.36)] backdrop-blur-xl sm:px-8 lg:px-9 lg:py-7">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-amber-300/25 bg-white/7 text-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.18)] sm:h-20 sm:w-20">
          <UserPlus size={36} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-normal text-white sm:text-3xl">Đăng ký</h1>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">Tạo tài khoản để bắt đầu hành trình bình an</p>
      </div>

      <form action={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-white">
            Họ và tên
            <span className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-slate-300 transition focus-within:border-amber-300/60">
              <UserRound size={19} className="text-amber-400" aria-hidden="true" />
              <input
                name="name"
                type="text"
                className="min-w-0 flex-1 bg-transparent text-base font-normal text-white outline-none placeholder:text-slate-500"
                placeholder="Nhập họ và tên của bạn"
              />
            </span>
          </label>

          <label className="grid gap-2 text-sm font-medium text-white">
            Email
            <span className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-slate-300 transition focus-within:border-amber-300/60">
              <Mail size={19} className="text-amber-400" aria-hidden="true" />
              <input
                name="email"
                type="email"
                required
                className="min-w-0 flex-1 bg-transparent text-base font-normal text-white outline-none placeholder:text-slate-500"
                placeholder="Nhập email của bạn"
              />
            </span>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-white">
          Số điện thoại <span className="text-sm font-normal text-slate-400">(tùy chọn)</span>
          <span className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-slate-300 transition focus-within:border-amber-300/60">
            <Phone size={19} className="text-amber-400" aria-hidden="true" />
            <input
              name="phone"
              type="tel"
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-white outline-none placeholder:text-slate-500"
              placeholder="Nhập số điện thoại"
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-white">
          Mật khẩu
          <span className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-slate-300 transition focus-within:border-amber-300/60">
            <LockKeyhole size={19} className="text-amber-400" aria-hidden="true" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-white outline-none placeholder:text-slate-500"
              placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
            />
            <button type="button" className="text-amber-400 transition hover:text-amber-200" onClick={() => setShowPassword((value) => !value)}>
              <Eye size={20} aria-hidden="true" />
              <span className="sr-only">Hiện hoặc ẩn mật khẩu</span>
            </button>
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-white">
          Xác nhận mật khẩu
          <span className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-slate-300 transition focus-within:border-amber-300/60">
            <LockKeyhole size={19} className="text-amber-400" aria-hidden="true" />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-white outline-none placeholder:text-slate-500"
              placeholder="Nhập lại mật khẩu"
            />
            <button type="button" className="text-amber-400 transition hover:text-amber-200" onClick={() => setShowConfirmPassword((value) => !value)}>
              <Eye size={20} aria-hidden="true" />
              <span className="sr-only">Hiện hoặc ẩn mật khẩu xác nhận</span>
            </button>
          </span>
        </label>

        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            name="terms"
            type="checkbox"
            required
            className="h-5 w-5 rounded border-amber-300/50 bg-transparent accent-amber-500"
          />
          <span>
            Tôi đồng ý với{" "}
            <Link href="/terms" className="font-medium text-amber-300 hover:text-amber-200">
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link href="/privacy-policy" className="font-medium text-amber-300 hover:text-amber-200">
              Chính sách bảo mật
            </Link>
          </span>
        </label>

        {message ? <p className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 rounded-xl border border-amber-300/25 bg-gradient-to-r from-[#b87424] via-[#d8912e] to-[#a96019] px-6 py-3.5 text-lg font-semibold text-white shadow-[0_24px_60px_rgba(251,191,36,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
          <ArrowRight size={22} aria-hidden="true" />
        </button>
      </form>

      <div className="mt-5 flex items-center gap-4 text-sm text-slate-400">
        <span className="h-px flex-1 bg-white/12" />
        hoặc đăng ký với
        <span className="h-px flex-1 bg-white/12" />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={signUpWithGoogle}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-base font-bold text-blue-500">G</span>
          {googleLoading ? "Đang chuyển đến Google..." : "Đăng ký với Google"}
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-slate-300 sm:text-base">
        Đã có tài khoản?{" "}
        <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-amber-300 hover:text-amber-200">
          Đăng nhập ngay
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}

import Link from "next/link";
import { AuthForm } from "@/components/forms/AuthForm";

export default function LoginPage() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-night">Đăng nhập</h1>
        <p className="mt-3 text-slate-600">Trở lại không gian Bình An của bạn.</p>
      </div>
      <AuthForm mode="login" />
      <p className="mt-6 text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link className="font-semibold text-night" href="/register">
          Đăng ký
        </Link>
      </p>
    </section>
  );
}

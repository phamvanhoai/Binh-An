import Link from "next/link";
import { AuthForm } from "@/components/forms/AuthForm";

export default function LoginPage() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-night">Dang nhap</h1>
        <p className="mt-3 text-slate-600">Tro lai khong gian Binh An cua ban.</p>
      </div>
      <AuthForm mode="login" />
      <p className="mt-6 text-center text-sm text-slate-600">
        Chua co tai khoan?{" "}
        <Link className="font-semibold text-night" href="/register">
          Dang ky
        </Link>
      </p>
    </section>
  );
}

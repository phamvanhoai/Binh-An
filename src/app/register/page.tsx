import Link from "next/link";
import { AuthForm } from "@/components/forms/AuthForm";

export default function RegisterPage() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-night">Dang ky</h1>
        <p className="mt-3 text-slate-600">Bat dau moi ngay bang mot khoanh khac cham lai.</p>
      </div>
      <AuthForm mode="register" />
      <p className="mt-6 text-center text-sm text-slate-600">
        Da co tai khoan?{" "}
        <Link className="font-semibold text-night" href="/login">
          Dang nhap
        </Link>
      </p>
    </section>
  );
}

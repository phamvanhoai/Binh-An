import Image from "next/image";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { RitualMiniImage } from "@/components/layout/DashboardSidebar";

export default function ResetPasswordPage() {
  return (
    <div className="auth-shell min-h-screen overflow-x-hidden bg-[#06111f] text-slate-100">
      <Image src="/assets/rituals/today-message-bg.png" width={1792} height={1024} alt="" aria-hidden="true" priority className="fixed inset-0 h-full w-full scale-110 object-cover opacity-35" />
      <span className="fixed inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.92),rgba(6,17,31,0.82),rgba(3,7,18,0.94))]" />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex w-fit items-center gap-3">
          <RitualMiniImage src="/assets/rituals/lantern.png" className="h-12 w-12" />
          <span className="text-2xl font-semibold text-white">Bình An</span>
        </Link>
        <div className="mx-auto flex w-full max-w-lg flex-1 items-center py-8">
          <ResetPasswordForm />
        </div>
      </main>
    </div>
  );
}

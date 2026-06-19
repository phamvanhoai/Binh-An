import Image from "next/image";
import Link from "next/link";
import { LoginGlassForm } from "@/components/forms/LoginGlassForm";
import { RitualMiniImage } from "@/components/layout/DashboardSidebar";

export default function LoginPage() {
  return (
    <div className="auth-shell min-h-screen overflow-hidden bg-[#06111f] text-slate-100">
      <Image
        src="/assets/rituals/today-message-bg.png"
        width={1792}
        height={1024}
        alt=""
        aria-hidden="true"
        priority
        className="fixed inset-0 h-full w-full scale-110 object-cover opacity-30 blur-[1px]"
      />
      <span className="fixed inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(56,189,248,0.12),transparent_26rem),linear-gradient(90deg,rgba(3,7,18,0.9),rgba(6,17,31,0.84)_48%,rgba(3,7,18,0.92))]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1720px] flex-col px-5 py-8 sm:px-8 lg:px-12">
        <Link href="/" className="flex w-fit items-center gap-4">
          <RitualMiniImage src="/assets/rituals/lantern.png" className="h-16 w-16" />
          <span>
            <span className="block text-3xl font-semibold tracking-normal text-white sm:text-4xl">Bình An</span>
            <span className="mt-1 block text-sm text-slate-300 sm:text-base">Nơi gửi những điều tốt đẹp</span>
          </span>
        </Link>

        <section className="grid flex-1 items-center gap-7 py-8 lg:grid-cols-[1.16fr_0.9fr] lg:gap-8 xl:px-28">
          <article className="relative hidden min-h-[44rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1727]/70 shadow-[0_32px_100px_rgba(0,0,0,0.32)] lg:block">
            <Image
              src="/assets/rituals/today-message-bg.png"
              width={1792}
              height={1024}
              alt=""
              aria-hidden="true"
              priority
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,25,0.32),rgba(8,13,25,0.1)_44%,rgba(8,13,25,0.1))]" />
            <div className="relative z-10 mx-auto mt-36 max-w-xl text-center">
              <p className="text-5xl leading-none text-amber-300">“</p>
              <h2 className="mt-3 text-4xl font-medium leading-[1.55] text-amber-100">
                Bình an là khi ta học
                <br />
                cách mỉm cười giữa
                <br />
                những cơn mưa.
              </h2>
              <p className="mt-6 text-lg text-slate-100">- Bình An</p>
            </div>
          </article>

          <div className="mx-auto w-full max-w-[40rem]">
            <LoginGlassForm />
          </div>
        </section>
      </main>
    </div>
  );
}

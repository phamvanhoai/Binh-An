import Image from "next/image";
import Link from "next/link";
import { Heart, ShieldCheck, Sprout, Users } from "lucide-react";
import { RegisterGlassForm } from "@/components/forms/RegisterGlassForm";
import { RitualMiniImage } from "@/components/layout/DashboardSidebar";

const benefits = [
  {
    icon: Sprout,
    text: "Ghi lại và lưu giữ những điều tốt đẹp mỗi ngày của bạn."
  },
  {
    icon: Users,
    text: "Kết nối với những người đồng nguyện và cùng lan tỏa yêu thương."
  },
  {
    icon: ShieldCheck,
    text: "Dữ liệu của bạn được bảo vệ an toàn và riêng tư."
  }
];

export default function RegisterPage() {
  return (
    <div className="auth-shell min-h-screen overflow-x-hidden bg-[#06111f] text-slate-100">
      <Image
        src="/assets/rituals/today-message-bg.png"
        width={1792}
        height={1024}
        alt=""
        aria-hidden="true"
        priority
        className="fixed inset-0 h-full w-full scale-110 object-cover object-center opacity-70"
      />
      <span className="fixed inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.55),rgba(3,7,18,0.36)_48%,rgba(3,7,18,0.82)),radial-gradient(circle_at_20%_18%,rgba(251,191,36,0.1),transparent_24rem)]" />

      <main className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8 xl:px-10">
        <section className="flex min-h-[34rem] flex-col">
          <Link href="/" className="flex w-fit items-center gap-4">
            <RitualMiniImage src="/assets/rituals/lantern.png" className="h-12 w-12 sm:h-14 sm:w-14" />
            <span>
              <span className="block text-2xl font-semibold tracking-normal text-white sm:text-3xl">Bình An</span>
              <span className="mt-1 block text-xs text-slate-300 sm:text-sm">Nơi gửi những điều tốt đẹp</span>
            </span>
          </Link>

          <div className="mt-10 max-w-xl lg:mt-14">
            <h1 className="text-3xl font-semibold leading-[1.35] text-amber-50 sm:text-4xl xl:text-[2.7rem]">
              Tạo tài khoản để bắt đầu
              <br className="hidden sm:block" />
              hành trình bình an của bạn 🌺
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-200 sm:text-lg">
              Tham gia cộng đồng Bình An để ghi lại những điều tốt đẹp và nuôi dưỡng lòng biết ơn mỗi ngày.
            </p>
          </div>

          <div className="mt-7 grid max-w-lg gap-4">
            {benefits.map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-amber-200/20 bg-white/8 text-amber-300">
                  <item.icon size={22} aria-hidden="true" />
                </span>
                <p className="text-sm leading-6 text-slate-100 sm:text-base">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto hidden max-w-xl rounded-2xl border border-amber-200/20 bg-[#160f16]/68 p-5 shadow-[0_22px_80px_rgba(0,0,0,0.25)] backdrop-blur-md lg:block">
            <div className="flex items-center gap-5">
              <span className="text-4xl leading-none text-amber-300">“</span>
              <p className="flex-1 text-base leading-7 text-amber-50">Hãy bắt đầu hành trình yêu thương bản thân và lan tỏa điều tốt đẹp mỗi ngày.</p>
              <Heart size={24} className="text-amber-300" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center py-2">
          <div className="w-full max-w-[43rem] xl:max-w-[46rem]">
            <RegisterGlassForm />
          </div>
        </section>
      </main>
    </div>
  );
}

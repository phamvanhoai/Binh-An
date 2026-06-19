import Link from "next/link";
import Image from "next/image";
import { Home, Menu, Search, Send, Sparkles, UserRound, Users, type LucideIcon } from "lucide-react";
import { LogoutButton } from "@/components/layout/LogoutButton";

type SidebarVariant = "prayers" | "today";

type DashboardSidebarProps = {
  activeHref: string;
  variant: SidebarVariant;
};

const navItems: Array<{ href: string; label: string; shortLabel: string; icon: LucideIcon }> = [
  { href: "/", label: "Trang chủ", shortLabel: "Trang chủ", icon: Home },
  { href: "/today", label: "Thông điệp hôm nay", shortLabel: "Thông điệp", icon: Sparkles },
  { href: "/prayers/new", label: "Gửi bình an", shortLabel: "Gửi bình an", icon: Send },
  { href: "/prayers", label: "Cộng đồng", shortLabel: "Cộng đồng", icon: Users },
  { href: "/profile", label: "Hồ sơ", shortLabel: "Hồ sơ", icon: UserRound }
];

const sidebarContent = {
  prayers: {
    image: "/assets/rituals/send-peace-hand-card.png",
    imageClass: "object-bottom",
    overlay: "bg-[linear-gradient(180deg,rgba(11,18,34,0.5),rgba(11,18,34,0.08)_52%,rgba(11,18,34,0.56))]",
    title: "Gửi bình an",
    description: "Viết một lời nguyện nhỏ, chọn nến, hương hoặc hoa đăng rồi gửi đi."
  },
  today: {
    image: "/assets/rituals/today-message-bg.png",
    imageClass: "object-center",
    overlay: "bg-[linear-gradient(180deg,rgba(11,18,34,0.72),rgba(11,18,34,0.32)_48%,rgba(11,18,34,0.76))]",
    title: "Thông điệp hôm nay",
    description: "Mỗi ngày một khoảng lặng ngắn để quay về với chính mình."
  }
} satisfies Record<
  SidebarVariant,
  {
    image: string;
    imageClass: string;
    overlay: string;
    title: string;
    description: string;
  }
>;

export function RitualMiniImage({
  src = "/assets/rituals/lantern.png",
  className = "h-8 w-8"
}: {
  src?: string;
  className?: string;
}) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center">
      <span className="absolute inset-0 rounded-full bg-amber-300/20 blur-lg" />
      <Image
        src={src}
        width={120}
        height={120}
        alt=""
        aria-hidden="true"
        className={`${className} relative z-10 object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]`}
      />
    </span>
  );
}

function DashboardMobileNav({ activeHref }: { activeHref: string }) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1222]/96 px-3 py-3 backdrop-blur-xl xl:hidden">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2">
          <RitualMiniImage src="/assets/rituals/lantern.png" className="h-9 w-9" />
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold text-white">Bình An</span>
            <span className="block truncate text-xs text-slate-400">Nơi gửi những điều tốt đẹp</span>
          </span>
        </Link>
        <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/6 text-slate-200">
          <Search size={17} aria-hidden="true" />
        </button>
        <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/6 text-slate-200">
          <Menu size={18} aria-hidden="true" />
        </button>
      </div>

      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => {
          const active = item.href === activeHref;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                active ? "border-amber-300/40 bg-amber-300/12 text-amber-100" : "border-white/10 bg-white/6 text-slate-300"
              }`}
            >
              <item.icon size={15} className={active ? "text-amber-300" : "text-slate-400"} aria-hidden="true" />
              {item.shortLabel}
            </Link>
          );
        })}
        <LogoutButton compact />
      </nav>
    </div>
  );
}

export function DashboardSidebar({ activeHref, variant }: DashboardSidebarProps) {
  const content = sidebarContent[variant];

  return (
    <>
      <DashboardMobileNav activeHref={activeHref} />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 bg-[#0b1222]/95 px-4 py-6 xl:flex">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-amber-200">
            <RitualMiniImage src="/assets/rituals/lantern.png" className="h-11 w-11" />
          </span>
          <span>
            <span className="block text-2xl font-semibold tracking-normal text-white">Bình An</span>
            <span className="text-sm text-slate-400">Nơi gửi những điều tốt đẹp</span>
          </span>
        </Link>

        <nav className="mt-10 grid gap-2">
          {navItems.map((item) => {
            const active = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active ? "bg-white/10 text-white shadow-[0_0_30px_rgba(251,191,36,0.12)]" : "text-slate-300 hover:bg-white/6 hover:text-white"
                }`}
              >
                <item.icon size={18} className={active ? "text-amber-300" : "text-slate-400"} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-10 min-h-72 overflow-hidden rounded-xl border border-amber-200/20 p-5">
          <Image
            src={content.image}
            width={variant === "today" ? 1792 : 1024}
            height={variant === "today" ? 1024 : 1536}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover ${content.imageClass}`}
          />
          <span className={`absolute inset-0 ${content.overlay}`} />
          <div className="relative z-10">
            <h2 className="text-lg font-semibold">{content.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200">{content.description}</p>
          </div>
          <Link href="/prayers/new" className="absolute bottom-5 left-5 right-5 z-10 rounded-lg bg-white/14 px-4 py-3 text-center text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
            Gửi lời bình an
          </Link>
        </div>

        <div className="mt-auto pt-6">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

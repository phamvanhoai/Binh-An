import Link from "next/link";
import { Flame, LayoutDashboard } from "lucide-react";

const links = [
  { href: "/today", label: "Hôm nay" },
  { href: "/prayers", label: "Lời nguyện" },
  { href: "/sky", label: "Bầu trời" },
  { href: "/letters", label: "Thư" },
  { href: "/gratitude", label: "Biết ơn" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-night">
          <span className="grid h-9 w-9 place-items-center rounded bg-night text-candle shadow-glow">
            <Flame size={19} aria-hidden="true" />
          </span>
          <span>Bình An</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-night">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-night hover:text-night sm:inline-flex"
          >
            Đăng nhập
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded bg-night px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <LayoutDashboard size={16} aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

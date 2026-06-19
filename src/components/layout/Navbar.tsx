import Link from "next/link";
import { redirect } from "next/navigation";
import { Flame, LogOut, UserRound } from "lucide-react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

const links = [
  { href: "/today", label: "Thông điệp" },
  { href: "/prayers/new", label: "Gửi bình an" },
  { href: "/prayers", label: "Cộng đồng" },
  { href: "/profile", label: "Hồ sơ" }
];

async function getAuthUser() {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

async function signOut() {
  "use server";

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}

export async function Navbar() {
  const user = await getAuthUser();
  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Tài khoản";

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

        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="hidden max-w-44 items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-night hover:text-night sm:inline-flex"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-night text-xs text-white">
                <UserRound size={14} aria-hidden="true" />
              </span>
              <span className="truncate">{displayName}</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded bg-night px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <LogOut size={16} aria-hidden="true" />
                Đăng xuất
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-night hover:text-night sm:inline-flex"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded bg-night px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <UserRound size={16} aria-hidden="true" />
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

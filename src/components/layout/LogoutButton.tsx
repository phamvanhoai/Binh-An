"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    if (loading) return;
    setLoading(true);

    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={
        compact
          ? "inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-400/8 px-3 py-2 text-xs font-medium text-rose-100 transition hover:bg-rose-400/14 disabled:opacity-60"
          : "flex w-full items-center gap-3 rounded-lg border border-rose-300/15 bg-rose-400/8 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-400/14 disabled:opacity-60"
      }
    >
      <LogOut size={compact ? 15 : 18} aria-hidden="true" />
      {loading ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}

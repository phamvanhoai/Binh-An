"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileWarning, Home, MessageSquareText, Shield, Users } from "lucide-react";
import { LogoutButton } from "@/components/layout/LogoutButton";

const items = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3 },
  { href: "/admin/messages", label: "Thông điệp", icon: MessageSquareText },
  { href: "/admin/prayers", label: "Lời bình an", icon: Shield },
  { href: "/admin/reports", label: "Báo cáo", icon: FileWarning },
  { href: "/admin/users", label: "Người dùng", icon: Users }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-amber-300">
              <Shield size={20} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold text-slate-950">Bình An Admin</span>
              <span className="block text-xs text-slate-500">Quản trị hệ thống</span>
            </span>
          </Link>
          <Link href="/" aria-label="Về trang web" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden">
            <Home size={17} aria-hidden="true" />
          </Link>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:grid lg:overflow-visible">
          {items.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <item.icon size={18} className={active ? "text-amber-300" : undefined} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden grid-cols-1 gap-2 pt-6 lg:grid">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <Home size={18} aria-hidden="true" />
            Về trang người dùng
          </Link>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

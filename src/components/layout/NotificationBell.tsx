"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, Flame, Mail, Sparkles, X } from "lucide-react";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  created_at: string;
  type: "reaction" | "letter" | "daily";
};

const lastSeenKey = "binh-an-notifications-last-seen";

function formatTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ trước`;
  return `${Math.floor(minutes / 1440)} ngày trước`;
}

function NotificationIcon({ type }: { type: NotificationItem["type"] }) {
  const className = "text-amber-300";
  if (type === "letter") return <Mail size={18} className={className} aria-hidden="true" />;
  if (type === "reaction") return <Flame size={18} className={className} aria-hidden="true" />;
  return <Sparkles size={18} className={className} aria-hidden="true" />;
}

export function NotificationBell() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then(async (response) => {
        setLastSeen(window.localStorage.getItem(lastSeenKey));
        if (response.status === 401) {
          setAuthenticated(false);
          return [];
        }
        const result = await response.json();
        return result.data || [];
      })
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const hasUnread = items.some((item) => !lastSeen || new Date(item.created_at) > new Date(lastSeen));

  function toggle() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      const now = new Date().toISOString();
      window.localStorage.setItem(lastSeenKey, now);
      setLastSeen(now);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Mở thông báo"
        aria-expanded={open}
        onClick={toggle}
        className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/6 text-slate-200 transition hover:bg-white/10 hover:text-white"
      >
        <Bell size={18} aria-hidden="true" />
        {hasUnread ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[#0b1222]" /> : null}
      </button>

      {open ? (
        <section className="absolute right-0 top-14 z-50 w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-white/10 bg-[#0d1727] shadow-2xl shadow-black/50">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <h2 className="font-semibold text-white">Thông báo</h2>
              <p className="mt-0.5 text-xs text-slate-500">{items.length ? `${items.length} cập nhật gần đây` : "Chưa có cập nhật mới"}</p>
            </div>
            <button type="button" aria-label="Đóng thông báo" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/8 hover:text-white">
              <X size={17} aria-hidden="true" />
            </button>
          </header>

          <div className="max-h-96 overflow-y-auto">
            {loading ? <p className="px-4 py-8 text-center text-sm text-slate-400">Đang tải thông báo...</p> : null}
            {!loading && !authenticated ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-300">Đăng nhập để xem thông báo của bạn.</p>
                <Link href="/login" className="mt-4 inline-flex rounded-lg bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-100">
                  Đăng nhập
                </Link>
              </div>
            ) : null}
            {!loading && authenticated && !items.length ? <p className="px-4 py-8 text-center text-sm text-slate-400">Mọi thứ đang yên bình.</p> : null}
            {!loading && authenticated
              ? items.map((item) => (
                  <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="flex gap-3 border-b border-white/8 px-4 py-4 transition last:border-0 hover:bg-white/6">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-300/10">
                      <NotificationIcon type={item.type} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white">{item.title}</span>
                      <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-400">{item.description}</span>
                      <span className="mt-1.5 block text-xs text-amber-200/70">{formatTime(item.created_at)}</span>
                    </span>
                  </Link>
                ))
              : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { Flame, HeartHandshake, Sparkles } from "lucide-react";

type PrayerCardProps = {
  id: string;
  content: string;
  type?: string | null;
  counts?: {
    pray?: number;
    peace?: number;
    candle?: number;
  };
};

export function PrayerCard({ id, content, type, counts }: PrayerCardProps) {
  const href = id.startsWith("demo") ? "/prayers" : `/prayers/${id}`;

  return (
    <Link href={href} className="soft-panel block rounded-lg p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
          {type || "peace"}
        </span>
        <Flame className="text-candle" size={20} aria-hidden="true" />
      </div>
      <p className="min-h-20 text-base leading-relaxed text-slate-800">{content}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1">
          <HeartHandshake size={15} aria-hidden="true" />
          {counts?.pray ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <Sparkles size={15} aria-hidden="true" />
          {counts?.peace ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <Flame size={15} aria-hidden="true" />
          {counts?.candle ?? 0}
        </span>
      </div>
    </Link>
  );
}

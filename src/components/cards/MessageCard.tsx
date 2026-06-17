import { Sparkles } from "lucide-react";

type MessageCardProps = {
  message: string;
  reflection?: string | null;
  category?: string | null;
};

export function MessageCard({ message, reflection, category }: MessageCardProps) {
  return (
    <article className="soft-panel rounded-lg p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded bg-night px-3 py-1 text-sm font-semibold text-candle">
          <Sparkles size={16} aria-hidden="true" />
          Thong diep hom nay
        </span>
        {category ? <span className="text-sm font-medium text-slate-500">{category}</span> : null}
      </div>
      <p className="text-xl font-semibold leading-relaxed text-night sm:text-2xl">{message}</p>
      {reflection ? (
        <div className="mt-6 border-l-4 border-candle pl-4 text-slate-700">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Cau hoi suy ngam</p>
          <p className="mt-1">{reflection}</p>
        </div>
      ) : null}
    </article>
  );
}

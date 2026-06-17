import { Flame, HeartHandshake, Sparkles } from "lucide-react";
import { demoPrayers } from "@/lib/demo-data";

export default async function PrayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prayer = demoPrayers.find((item) => item.id === id) || demoPrayers[0];

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="soft-panel rounded-lg p-6">
        <p className="mb-4 rounded bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 w-fit">{prayer.type}</p>
        <h1 className="text-2xl font-semibold leading-relaxed text-night">{prayer.content}</h1>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: HeartHandshake, label: "Dong nguyen", value: prayer.pray },
            { icon: Sparkles, label: "An lanh", value: prayer.peace },
            { icon: Flame, label: "Nen", value: prayer.candle }
          ].map((item) => (
            <form key={item.label} action={`/api/prayers/${id}/reactions`} method="post">
              <button className="flex w-full items-center justify-center gap-2 rounded border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:border-night hover:text-night">
                <item.icon size={17} aria-hidden="true" />
                {item.label} {item.value}
              </button>
            </form>
          ))}
        </div>
      </article>
    </section>
  );
}

import { PrayerCard } from "@/components/cards/PrayerCard";
import { demoPrayers } from "@/lib/demo-data";

export default function SkyPage() {
  return (
    <section className="min-h-[75vh] bg-night text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bầu trời Bình An</h1>
          <p className="mt-2 text-slate-300">Những điểm sáng nhỏ từ các lời nguyện công khai.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {demoPrayers.map((prayer) => (
            <PrayerCard key={prayer.id} id={prayer.id} content={prayer.content} type={prayer.type} counts={prayer} />
          ))}
        </div>
      </div>
    </section>
  );
}

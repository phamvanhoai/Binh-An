import Link from "next/link";
import { PrayerCard } from "@/components/cards/PrayerCard";
import { demoPrayers } from "@/lib/demo-data";

export default function PrayersPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-night">Loi nguyen</h1>
          <p className="mt-2 text-slate-600">Nhung ngon nen cong khai an danh tu cong dong.</p>
        </div>
        <Link href="/prayers/new" className="rounded bg-night px-4 py-3 text-center font-semibold text-white">
          Tao loi nguyen
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {demoPrayers.map((prayer) => (
          <PrayerCard key={prayer.id} id={prayer.id} content={prayer.content} type={prayer.type} counts={prayer} />
        ))}
      </div>
    </section>
  );
}

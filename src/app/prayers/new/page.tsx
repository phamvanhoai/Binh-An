import { PrayerRitualForm } from "@/components/forms/PrayerRitualForm";

export default function NewPrayerPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">Tạo lời nguyện</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Chọn một nghi thức nhỏ để gửi lời nguyện đi: thả hoa đăng, thắp nến hoặc thắp hương.
      </p>
      <div className="mt-8">
        <PrayerRitualForm />
      </div>
    </section>
  );
}

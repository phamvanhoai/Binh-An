import { ApiForm } from "@/components/forms/ApiForm";

export default function NewGratitudePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">Ghi dieu biet on</h1>
      <p className="mt-2 text-slate-600">Mot dong nho cung du de giu lai dieu dep trong ngay.</p>
      <div className="mt-8">
        <ApiForm
          endpoint="/api/gratitude"
          submitLabel="Luu dieu biet on"
          fields={[
            { name: "content", label: "Noi dung", type: "textarea", required: true },
            { name: "entry_date", label: "Ngay", type: "date" }
          ]}
        />
      </div>
    </section>
  );
}

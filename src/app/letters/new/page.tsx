import { ApiForm } from "@/components/forms/ApiForm";

export default function NewLetterPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">Viet thu cho tuong lai</h1>
      <p className="mt-2 text-slate-600">Noi dung se duoc khoa cho den ngay mo thu.</p>
      <div className="mt-8">
        <ApiForm
          endpoint="/api/letters"
          submitLabel="Luu la thu"
          fields={[
            { name: "title", label: "Tieu de", required: true },
            { name: "content", label: "Noi dung", type: "textarea", required: true },
            { name: "open_at", label: "Ngay gio mo", type: "datetime-local", required: true }
          ]}
        />
      </div>
    </section>
  );
}

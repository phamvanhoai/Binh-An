import { ApiForm } from "@/components/forms/ApiForm";

export default function NewLetterPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">Viết thư cho tương lai</h1>
      <p className="mt-2 text-slate-600">Nội dung sẽ được khóa cho đến ngày mở thư.</p>
      <div className="mt-8">
        <ApiForm
          endpoint="/api/letters"
          submitLabel="Lưu lá thư"
          fields={[
            { name: "title", label: "Tiêu đề", required: true },
            { name: "content", label: "Nội dung", type: "textarea", required: true },
            { name: "open_at", label: "Ngày giờ mở", type: "datetime-local", required: true }
          ]}
        />
      </div>
    </section>
  );
}

import { ApiForm } from "@/components/forms/ApiForm";

export default function NewGratitudePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">Ghi điều biết ơn</h1>
      <p className="mt-2 text-slate-600">Một dòng nhỏ cũng đủ để giữ lại điều đẹp trong ngày.</p>
      <div className="mt-8">
        <ApiForm
          endpoint="/api/gratitude"
          submitLabel="Lưu điều biết ơn"
          fields={[
            { name: "content", label: "Nội dung", type: "textarea", required: true },
            { name: "entry_date", label: "Ngày", type: "date" }
          ]}
        />
      </div>
    </section>
  );
}

import { ApiForm } from "@/components/forms/ApiForm";

export default function NewPrayerPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">Tao loi nguyen</h1>
      <p className="mt-2 text-slate-600">Chon cong khai an danh hoac giu rieng tu cho minh.</p>
      <div className="mt-8">
        <ApiForm
          endpoint="/api/prayers"
          submitLabel="Gui loi nguyen"
          fields={[
            { name: "content", label: "Noi dung", type: "textarea", required: true },
            {
              name: "type",
              label: "Loai",
              type: "select",
              options: [
                { label: "Cau binh an", value: "peace" },
                { label: "Mong uoc", value: "wish" },
                { label: "Biet on", value: "gratitude" },
                { label: "Tuong nho", value: "memorial" },
                { label: "Lo lang", value: "worry" }
              ]
            },
            {
              name: "visibility",
              label: "Trang thai",
              type: "select",
              options: [
                { label: "Cong khai an danh", value: "public_anonymous" },
                { label: "Rieng tu", value: "private" }
              ]
            }
          ]}
        />
      </div>
    </section>
  );
}

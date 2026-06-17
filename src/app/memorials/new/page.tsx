import { ApiForm } from "@/components/forms/ApiForm";

export default function NewMemorialPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">Tao goc tuong nho</h1>
      <p className="mt-2 text-slate-600">Mot noi nhe nhang de luu giu ky uc ve nguoi than.</p>
      <div className="mt-8">
        <ApiForm
          endpoint="/api/memorials"
          submitLabel="Luu ho so"
          fields={[
            { name: "name", label: "Ten nguoi than", required: true },
            { name: "relationship", label: "Moi quan he" },
            { name: "birth_date", label: "Ngay sinh", type: "date" },
            { name: "death_date", label: "Ngay mat", type: "date" },
            { name: "avatar_url", label: "URL anh dai dien", type: "url" },
            { name: "message", label: "Loi nhan", type: "textarea" },
            {
              name: "visibility",
              label: "Trang thai",
              type: "select",
              options: [
                { label: "Rieng tu", value: "private" },
                { label: "Cong khai bang link", value: "public_link" }
              ]
            }
          ]}
        />
      </div>
    </section>
  );
}

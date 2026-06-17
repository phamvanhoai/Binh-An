import { ApiForm } from "@/components/forms/ApiForm";

export default function NewMemorialPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">Tạo góc tưởng nhớ</h1>
      <p className="mt-2 text-slate-600">Một nơi nhẹ nhàng để lưu giữ ký ức về người thân.</p>
      <div className="mt-8">
        <ApiForm
          endpoint="/api/memorials"
          submitLabel="Lưu hồ sơ"
          fields={[
            { name: "name", label: "Tên người thân", required: true },
            { name: "relationship", label: "Mối quan hệ" },
            { name: "birth_date", label: "Ngày sinh", type: "date" },
            { name: "death_date", label: "Ngày mất", type: "date" },
            { name: "avatar_url", label: "URL ảnh đại diện", type: "url" },
            { name: "message", label: "Lời nhắn", type: "textarea" },
            {
              name: "visibility",
              label: "Trạng thái",
              type: "select",
              options: [
                { label: "Riêng tư", value: "private" },
                { label: "Công khai bằng link", value: "public_link" }
              ]
            }
          ]}
        />
      </div>
    </section>
  );
}

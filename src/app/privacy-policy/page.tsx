export default function PrivacyPolicyPage() {
  return (
    <Policy title="Chính sách bảo mật">
      Bình An chỉ thu thập dữ liệu cần thiết để vận hành tài khoản, lưu nội dung riêng tư và hiển thị nội dung công khai mà bạn chọn chia sẻ. Secret và service role key không bao giờ được đưa ra client.
    </Policy>
  );
}

function Policy({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto min-h-[70vh] max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-night">{title}</h1>
      <p className="mt-5 leading-8 text-slate-700">{children}</p>
    </section>
  );
}

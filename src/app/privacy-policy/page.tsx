export default function PrivacyPolicyPage() {
  return (
    <Policy title="Chinh sach bao mat">
      Binh An chi thu thap du lieu can thiet de van hanh tai khoan, luu noi dung rieng tu va hien thi noi dung cong khai ma ban chon chia se. Secret va service role key khong bao gio duoc dua ra client.
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

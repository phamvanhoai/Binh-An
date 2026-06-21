import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/65">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2026 Bình An. Mỗi ngày một phút bình an.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/home" className="hover:text-night">
            Giới thiệu ứng dụng
          </Link>
          <Link href="/privacy-policy" className="hover:text-night">
            Chính sách bảo mật
          </Link>
          <Link href="/terms" className="hover:text-night">
            Điều khoản
          </Link>
          <Link href="/community-guidelines" className="hover:text-night">
            Hướng dẫn cộng đồng
          </Link>
        </div>
      </div>
    </footer>
  );
}

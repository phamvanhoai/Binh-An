import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BookHeart,
  ChevronRight,
  Flame,
  HeartHandshake,
  LockKeyhole,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";

export const metadata: Metadata = {
  title: "Giới thiệu ứng dụng",
  description:
    "Trang chủ chính thức của Bình An, ứng dụng gửi lời bình an, đọc thông điệp mỗi ngày và đồng nguyện cùng cộng đồng.",
  alternates: {
    canonical: "/home"
  }
};

const features = [
  {
    icon: Sparkles,
    title: "Thông điệp mỗi ngày",
    description: "Đón nhận một thông điệp tích cực và câu hỏi suy ngẫm để bắt đầu hoặc khép lại ngày mới nhẹ nhàng hơn."
  },
  {
    icon: Flame,
    title: "Gửi lời bình an",
    description: "Viết lời nguyện và chọn nghi thức tượng trưng như thắp nến, thắp hương hoặc thả hoa đăng."
  },
  {
    icon: HeartHandshake,
    title: "Cộng đồng đồng nguyện",
    description: "Chia sẻ lời bình an dưới dạng ẩn danh và gửi sự đồng nguyện đến những nội dung công khai của cộng đồng."
  },
  {
    icon: BookHeart,
    title: "Hành trình cá nhân",
    description: "Lưu lại lòng biết ơn, thư gửi tương lai, góc tưởng nhớ và những dấu mốc riêng tư trong tài khoản."
  }
];

const dataUses = [
  {
    icon: UserRound,
    title: "Thông tin tài khoản",
    description:
      "Khi đăng nhập bằng Google, Bình An nhận địa chỉ email, tên hiển thị, ảnh đại diện và mã định danh tài khoản do Google cung cấp để tạo, xác thực và hiển thị hồ sơ của bạn."
  },
  {
    icon: MessageCircleHeart,
    title: "Nội dung bạn tạo",
    description:
      "Lời nguyện, phản hồi, thư, nhật ký biết ơn và nội dung tưởng nhớ được lưu để cung cấp đúng các chức năng bạn chủ động sử dụng."
  },
  {
    icon: Bell,
    title: "Thông báo và hoạt động",
    description:
      "Dữ liệu hoạt động cần thiết được dùng để hiển thị tiến trình, thông báo liên quan và duy trì trải nghiệm nhất quán trên tài khoản của bạn."
  }
];

export default function PublicHomePage() {
  return (
    <div className="bg-[#07101f] text-slate-100">
      <section className="relative isolate min-h-[42rem] overflow-hidden">
        <Image
          src="/assets/rituals/today-message-bg.png"
          alt="Hoa đăng phát sáng trên mặt nước trong đêm"
          fill
          priority
          className="object-cover object-[68%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,22,0.97)_0%,rgba(4,10,22,0.86)_42%,rgba(4,10,22,0.3)_76%,rgba(4,10,22,0.48)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07101f] to-transparent" />

        <div className="relative mx-auto flex min-h-[42rem] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-amber-200">
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-amber-200/25 bg-amber-300/10">
                <Flame size={23} aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold">Bình An</span>
            </div>
            <h1 className="mt-8 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Một khoảng lặng nhỏ cho mỗi ngày
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
              Bình An là ứng dụng giúp bạn đọc thông điệp tích cực, gửi lời nguyện, lưu lại hành trình tinh thần và lan tỏa sự đồng
              nguyện trong một không gian nhẹ nhàng, tôn trọng quyền riêng tư.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Bắt đầu với Bình An
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <ShieldCheck size={17} aria-hidden="true" />
                Chính sách bảo mật
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">Bạn có thể xem toàn bộ trang giới thiệu và chính sách mà không cần đăng nhập.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-amber-300">Chức năng ứng dụng</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Bình An giúp bạn làm gì?</h2>
          <p className="mt-5 leading-8 text-slate-300">
            Các chức năng được thiết kế để hỗ trợ thói quen suy ngẫm tích cực và kết nối tử tế. Bình An không thay thế dịch vụ y
            tế, tư vấn tâm lý, pháp lý hoặc hỗ trợ khẩn cấp.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="bg-[#0b1628] p-6 sm:p-8">
              <feature.icon className="text-amber-300" size={25} aria-hidden="true" />
              <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1425]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-300/10 text-emerald-200">
              <LockKeyhole size={25} aria-hidden="true" />
            </span>
            <p className="mt-6 text-sm font-semibold uppercase text-emerald-200">Minh bạch dữ liệu</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">Vì sao ứng dụng yêu cầu dữ liệu của bạn?</h2>
            <p className="mt-5 leading-8 text-slate-300">
              Bình An chỉ yêu cầu dữ liệu cần thiết để xác thực tài khoản, cung cấp các chức năng bạn lựa chọn và bảo vệ trải
              nghiệm của bạn. Ứng dụng không yêu cầu quyền truy cập Google Drive, danh bạ, lịch, email hoặc mật khẩu Google.
            </p>
          </div>

          <div className="grid gap-4">
            {dataUses.map((item) => (
              <article key={item.title} className="grid gap-4 border-b border-white/10 pb-6 sm:grid-cols-[3rem_1fr]">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/5 text-amber-200">
                  <item.icon size={21} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-400">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-amber-300">Quyền kiểm soát của bạn</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Bạn quyết định nội dung nào được chia sẻ</h2>
            <div className="mt-7 space-y-5 text-slate-300">
              <p className="leading-8">
                Nội dung cá nhân được giữ riêng tư theo lựa chọn của bạn. Chỉ những lời nguyện bạn chủ động đặt ở chế độ công khai
                ẩn danh mới xuất hiện trong khu vực cộng đồng.
              </p>
              <p className="leading-8">
                Bạn có thể cập nhật hồ sơ, quản lý nội dung và đăng xuất khỏi tài khoản. Thông tin chi tiết về lưu trữ, chia sẻ,
                bảo mật và yêu cầu xóa dữ liệu được trình bày trong Chính sách bảo mật.
              </p>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <ShieldCheck className="text-emerald-200" size={30} aria-hidden="true" />
            <h2 className="mt-5 text-xl font-semibold text-white">Tài liệu và hỗ trợ</h2>
            <div className="mt-6 grid gap-3">
              <Link href="/privacy-policy" className="flex items-center justify-between border-b border-white/10 py-4 text-slate-200 hover:text-amber-200">
                Chính sách bảo mật
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/terms" className="flex items-center justify-between border-b border-white/10 py-4 text-slate-200 hover:text-amber-200">
                Điều khoản sử dụng
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/community-guidelines" className="flex items-center justify-between border-b border-white/10 py-4 text-slate-200 hover:text-amber-200">
                Hướng dẫn cộng đồng
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
              <p className="py-4 text-sm leading-7 text-slate-400">
                Thông tin liên hệ hỗ trợ và yêu cầu dữ liệu được công bố trên Chính sách bảo mật của tên miền triển khai chính thức.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

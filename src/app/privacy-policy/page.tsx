import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Chính sách thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu người dùng của ứng dụng Bình An.",
  alternates: {
    canonical: "/privacy-policy"
  }
};

const sections = [
  {
    title: "1. Dữ liệu Bình An thu thập",
    content: [
      "Khi bạn đăng nhập bằng Google, chúng tôi nhận mã định danh tài khoản, địa chỉ email, tên hiển thị và ảnh đại diện do Google cung cấp. Bình An không nhận hoặc lưu mật khẩu Google của bạn.",
      "Khi sử dụng ứng dụng, chúng tôi lưu nội dung bạn chủ động tạo như lời nguyện, lượt đồng nguyện, thư gửi tương lai, nhật ký biết ơn, nội dung tưởng nhớ, tùy chọn hồ sơ và thông báo liên quan.",
      "Hệ thống có thể ghi nhận dữ liệu kỹ thuật cần thiết như thời điểm hoạt động và thông tin phiên đăng nhập để vận hành, bảo mật và khắc phục lỗi."
    ]
  },
  {
    title: "2. Mục đích sử dụng dữ liệu",
    content: [
      "Dữ liệu tài khoản được dùng để xác thực, duy trì phiên đăng nhập, đồng bộ hồ sơ và gắn nội dung của bạn với đúng tài khoản.",
      "Nội dung và dữ liệu hoạt động được dùng để cung cấp các chức năng bạn lựa chọn, hiển thị tiến trình cá nhân, gửi thông báo liên quan và duy trì an toàn cộng đồng.",
      "Bình An không sử dụng dữ liệu Google của bạn cho quảng cáo và không bán dữ liệu cá nhân."
    ]
  },
  {
    title: "3. Chia sẻ và hiển thị dữ liệu",
    content: [
      "Nội dung riêng tư chỉ được hiển thị trong tài khoản của bạn. Lời nguyện chỉ xuất hiện ở cộng đồng khi bạn chủ động chọn chế độ công khai ẩn danh.",
      "Dữ liệu có thể được xử lý bởi nhà cung cấp hạ tầng cần thiết để vận hành ứng dụng, chẳng hạn dịch vụ xác thực, cơ sở dữ liệu và lưu trữ. Các bên này chỉ xử lý dữ liệu theo phạm vi cung cấp dịch vụ.",
      "Chúng tôi có thể cung cấp dữ liệu khi pháp luật yêu cầu hoặc khi cần thiết để bảo vệ người dùng, ngăn gian lận và xử lý hành vi vi phạm."
    ]
  },
  {
    title: "4. Lưu trữ và bảo mật",
    content: [
      "Bình An áp dụng biện pháp kỹ thuật và tổ chức phù hợp để hạn chế truy cập trái phép, mất mát hoặc lạm dụng dữ liệu. Khóa bí mật và khóa quản trị không được gửi đến trình duyệt hoặc ứng dụng người dùng.",
      "Dữ liệu được lưu trong thời gian cần thiết để cung cấp dịch vụ, thực hiện nghĩa vụ pháp lý và giải quyết vấn đề bảo mật."
    ]
  },
  {
    title: "5. Quyền của người dùng",
    content: [
      "Bạn có thể xem và cập nhật thông tin hồ sơ, quản lý nội dung đã tạo, thay đổi lựa chọn chia sẻ và đăng xuất khỏi tài khoản.",
      "Bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân qua kênh hỗ trợ được công bố trên tên miền triển khai chính thức. Chúng tôi có thể cần xác minh danh tính trước khi xử lý yêu cầu."
    ]
  },
  {
    title: "6. Dữ liệu từ Google",
    content: [
      "Việc Bình An sử dụng và chuyển dữ liệu nhận từ API của Google tuân thủ Chính sách dữ liệu người dùng của dịch vụ API Google, bao gồm các yêu cầu về sử dụng hạn chế.",
      "Bình An chỉ dùng dữ liệu đăng nhập Google để xác thực và thiết lập hồ sơ. Ứng dụng không yêu cầu quyền truy cập Gmail, Google Drive, Lịch hoặc Danh bạ."
    ]
  },
  {
    title: "7. Thay đổi và liên hệ",
    content: [
      "Chính sách này có thể được cập nhật khi chức năng hoặc yêu cầu pháp lý thay đổi. Ngày cập nhật gần nhất: 21 tháng 6 năm 2026.",
      "Thông tin liên hệ phụ trách quyền riêng tư sẽ được công bố trên tên miền triển khai chính thức trước khi ứng dụng được phát hành rộng rãi."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/home" className="text-sm font-semibold text-amber-700 hover:text-amber-800">
        ← Trang chủ Bình An
      </Link>
      <h1 className="mt-5 text-3xl font-bold text-night sm:text-4xl">Chính sách bảo mật</h1>
      <p className="mt-4 text-sm text-slate-500">Có hiệu lực từ ngày 21 tháng 6 năm 2026</p>
      <p className="mt-6 leading-8 text-slate-700">
        Bình An tôn trọng quyền riêng tư của bạn. Chính sách này giải thích dữ liệu chúng tôi thu thập, lý do sử dụng, cách dữ
        liệu được bảo vệ và các lựa chọn mà bạn có khi sử dụng website hoặc ứng dụng Bình An.
      </p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-night">{section.title}</h2>
            <div className="mt-4 space-y-3 leading-8 text-slate-700">
              {section.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

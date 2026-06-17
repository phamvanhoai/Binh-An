# YÊU CẦU PHÁT TRIỂN WEB + API CHO APP “BÌNH AN”

## 1. Tổng quan sản phẩm

**Tên sản phẩm:** Bình An  
**Định vị:** Nơi gửi những điều tốt đẹp, lưu giữ ký ức, lời nguyện, lòng biết ơn và thư gửi tương lai.  
**Mục tiêu:** Xây dựng nền tảng web kèm API để sau này ứng dụng Android/iOS có thể sử dụng chung backend.

Bình An không phải app bói toán, không phải mạng xã hội toxic, không phải app tôn giáo cụ thể. Đây là một không gian số nhẹ nhàng, tích cực, riêng tư và có cộng đồng văn minh.

### Giá trị cốt lõi

- Mỗi ngày người dùng chỉ mở được **1 thông điệp hôm nay**.
- Người dùng có thể thắp nến/hương ảo và gửi lời nguyện.
- Người khác có thể “đồng nguyện”, “gửi an lành”, “thắp thêm nến”.
- Người dùng có thể viết nhật ký biết ơn.
- Người dùng có thể gửi thư cho chính mình trong tương lai.
- Người dùng có thể tạo góc tưởng nhớ cho người thân đã mất.
- Web có thể dùng để chia sẻ lời nguyện/thông điệp ra Facebook, Zalo, Instagram Story.

---

## 2. Stack công nghệ đề xuất

Ưu tiên code đơn giản, dễ mở rộng, phù hợp MVP.

### Frontend + Backend

- Framework: **Next.js 16**
- Router: **App Router**
- Language: **TypeScript**
- Styling: **Tailwind CSS**
- UI Component: có thể dùng **shadcn/ui** nếu cần
- API: dùng **Next.js Route Handlers** trong thư mục `app/api`

### Database / Auth / Storage

- Database: **Supabase PostgreSQL**
- Auth: **Supabase Auth**
- Storage: **Supabase Storage** dùng cho ảnh tưởng nhớ, avatar, ảnh chia sẻ
- Realtime: chưa cần ở MVP, nhưng thiết kế database để sau này mở rộng

### Khác

- Validation: **Zod**
- ORM: có thể dùng **Prisma** hoặc query trực tiếp Supabase client. Ưu tiên Supabase client để đơn giản.
- Date handling: **date-fns**
- SEO: Next.js Metadata API
- Deploy: Vercel

---

## 3. Vai trò người dùng

### Guest

Khách chưa đăng nhập có thể:

- Xem landing page.
- Xem trang chia sẻ lời nguyện công khai.
- Xem trang chia sẻ thông điệp hôm nay.
- Xem trang tải app.
- Đăng ký / đăng nhập.

### User

Người dùng đã đăng nhập có thể:

- Mở thông điệp hôm nay.
- Tạo lời nguyện / ngọn nến.
- Chọn công khai hoặc riêng tư.
- Đồng nguyện với lời nguyện công khai của người khác.
- Viết nhật ký biết ơn.
- Viết thư gửi tương lai.
- Tạo góc tưởng nhớ.
- Quản lý hồ sơ cá nhân.

### Admin

Admin có thể:

- Quản lý thông điệp hằng ngày.
- Ẩn/xóa lời nguyện vi phạm.
- Quản lý báo cáo nội dung.
- Xem thống kê cơ bản.

---

## 4. Chức năng web cần có

## 4.1 Landing Page

Đường dẫn: `/`

Nội dung cần có:

- Hero section:
  - Tên app: **Bình An**
  - Slogan: **Mỗi ngày một phút bình an**
  - Mô tả: “Nơi gửi lời nguyện, lưu giữ ký ức và nhận một thông điệp tích cực mỗi ngày.”
- CTA:
  - “Bắt đầu ngay”
  - “Tải ứng dụng”
- Section giới thiệu:
  - Thông điệp hôm nay
  - Thắp nến bình an
  - Đồng nguyện cùng cộng đồng
  - Gửi mình trong tương lai
  - Góc tưởng nhớ
  - Hành trình biết ơn
- Section cộng đồng:
  - Hiển thị một số lời nguyện công khai mới nhất
- Footer:
  - Chính sách bảo mật
  - Điều khoản sử dụng
  - Liên hệ

Phong cách giao diện:

- Tối giản, ấm áp.
- Màu chính: xanh đêm, vàng nến, trắng kem, xanh lá nhạt.
- Không thiết kế quá giống app tôn giáo.
- Ưu tiên cảm giác hiện đại, bình yên, thân thiện.

---

## 4.2 Trang đăng nhập / đăng ký

Đường dẫn:

- `/login`
- `/register`

Chức năng:

- Đăng ký bằng email/password.
- Đăng nhập bằng email/password.
- Có thể chuẩn bị sẵn Google Login nếu Supabase hỗ trợ.
- Sau đăng nhập chuyển về `/dashboard`.

---

## 4.3 Dashboard cá nhân

Đường dẫn: `/dashboard`

Chỉ user đã đăng nhập được vào.

Hiển thị:

- Thông điệp hôm nay.
- Streak số ngày mở app/web liên tục.
- Nút tạo lời nguyện.
- Nút viết điều biết ơn.
- Nút viết thư tương lai.
- Nút tạo góc tưởng nhớ.
- Danh sách hoạt động gần đây của user.

---

## 4.4 Thông Điệp Hôm Nay

Đường dẫn:

- `/today`
- `/messages/[date]`

Luật chính:

- Mỗi user chỉ được mở 1 thông điệp/ngày.
- Nếu đã mở trong ngày, hiển thị lại thông điệp đó.
- Không cho đổi thông điệp khác trong cùng ngày.
- Guest có thể xem bản demo, nhưng muốn lưu streak thì cần đăng nhập.

Dữ liệu thông điệp gồm:

- Nội dung chính.
- Câu hỏi suy ngẫm nếu có.
- Chủ đề: bình an, biết ơn, hy vọng, buông bỏ, yêu thương, ký ức.
- Ảnh nền/chủ đề nếu có.

Ví dụ thông điệp:

> Có những điều không cần vội vàng. Hôm nay, hãy cho bản thân được thở chậm lại một chút.

---

## 4.5 Ngọn Nến Bình An / Lời Nguyện

Đường dẫn:

- `/prayers`
- `/prayers/new`
- `/prayers/[id]`

Người dùng có thể tạo lời nguyện với các trường:

- Nội dung lời nguyện.
- Loại:
  - Mong ước
  - Biết ơn
  - Tưởng nhớ
  - Lo lắng
  - Cầu bình an
- Trạng thái:
  - Công khai ẩn danh
  - Riêng tư
- Cho phép người khác đồng nguyện hay không.

Trang `/prayers`:

- Hiển thị các lời nguyện công khai.
- Không hiển thị tên thật nếu người dùng chọn ẩn danh.
- Giao diện giống “bầu trời đốm sáng” hoặc card đơn giản cho MVP.

Trang `/prayers/[id]`:

- Hiển thị nội dung lời nguyện.
- Số lượt đồng nguyện.
- Số lượt gửi an lành.
- Số lượt thắp thêm nến.
- Nút chia sẻ.

Reaction được phép:

- `pray`: Đồng nguyện
- `peace`: Gửi an lành
- `candle`: Thắp thêm nến

Không có bình luận tự do trong MVP để tránh toxic.

---

## 4.6 Bầu Trời Bình An

Đường dẫn: `/sky`

Mục tiêu:

- Tạo cảm giác cộng đồng tích cực.
- Hiển thị các lời nguyện công khai dưới dạng đốm sáng hoặc card.

MVP có thể làm đơn giản:

- Grid card nền tối.
- Mỗi card là một lời nguyện ngắn.
- Có icon nến/ánh sáng.
- Click vào card để xem chi tiết.

Sau này có thể nâng cấp thành canvas animation.

---

## 4.7 Gửi Mình Trong Tương Lai

Đường dẫn:

- `/letters`
- `/letters/new`
- `/letters/[id]`

Chức năng:

- User viết thư cho chính mình.
- Chọn ngày mở thư.
- Trước ngày mở, không cho xem nội dung thư.
- Đến ngày mở, user có thể đọc.
- Có trạng thái:
  - locked
  - opened

Form tạo thư:

- Tiêu đề.
- Nội dung.
- Ngày mở.

Luật:

- User chỉ xem được thư của chính mình.
- Không public thư trong MVP.

Dashboard cần hiển thị:

- Số thư đang chờ mở.
- Thư sắp mở gần nhất.

---

## 4.8 Góc Tưởng Nhớ

Đường dẫn:

- `/memorials`
- `/memorials/new`
- `/memorials/[id]`

Chức năng:

User tạo hồ sơ tưởng nhớ người thân:

- Tên người thân.
- Năm sinh.
- Năm mất.
- Ảnh đại diện.
- Mối quan hệ.
- Lời nhắn.
- Ngày sinh.
- Ngày giỗ/ngày mất.
- Trạng thái:
  - Riêng tư
  - Công khai bằng link

Trong trang chi tiết:

- Hiển thị ảnh.
- Hiển thị lời nhắn.
- Cho phép thắp nến.
- Cho phép thêm kỷ niệm ngắn.

MVP có thể chỉ cần:

- Tạo hồ sơ.
- Xem hồ sơ.
- Thắp nến.
- Sửa/xóa hồ sơ của chính mình.

---

## 4.9 Hành Trình Biết Ơn

Đường dẫn:

- `/gratitude`
- `/gratitude/new`

Chức năng:

- Mỗi ngày user có thể ghi một hoặc nhiều điều biết ơn.
- Hiển thị dạng lịch hoặc timeline.
- Có thể xem lại theo ngày/tháng.

MVP:

- Form nhập nội dung.
- Danh sách điều biết ơn gần đây.
- Bộ lọc theo tháng.

Sau này:

- Xuất PDF “365 điều tốt đẹp”.
- Tạo ảnh chia sẻ.

---

## 4.10 Trang chính sách

Cần có:

- `/privacy-policy`
- `/terms`
- `/community-guidelines`

Nội dung cần nhấn mạnh:

- Không khuyến khích mê tín cực đoan.
- Không thay thế tư vấn y tế, tâm lý, pháp lý.
- Không cho phép nội dung thù ghét, xúc phạm, kích động tự hại, bạo lực.
- Nội dung công khai có thể bị ẩn/xóa nếu vi phạm.

---

# 5. Database schema đề xuất

Dùng Supabase PostgreSQL.

## 5.1 `profiles`

Lưu thông tin public của user.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 5.2 `daily_messages`

Kho thông điệp hằng ngày.

```sql
create table daily_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  reflection_question text,
  category text not null,
  active_date date unique,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

Ghi chú:

- `active_date` dùng để gán thông điệp cụ thể cho một ngày.
- Nếu không có active_date, API có thể random một thông điệp active.

---

## 5.3 `user_daily_messages`

Lưu việc user đã mở thông điệp nào trong ngày.

```sql
create table user_daily_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  message_id uuid references daily_messages(id) on delete cascade,
  opened_date date not null,
  created_at timestamptz default now(),
  unique(user_id, opened_date)
);
```

---

## 5.4 `prayers`

Lời nguyện/ngọn nến.

```sql
create table prayers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  type text not null,
  visibility text not null default 'public_anonymous',
  allow_reactions boolean default true,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Giá trị `type`:

- `wish`
- `gratitude`
- `memorial`
- `worry`
- `peace`

Giá trị `visibility`:

- `private`
- `public_anonymous`

Giá trị `status`:

- `active`
- `hidden`
- `deleted`

---

## 5.5 `prayer_reactions`

Reaction cho lời nguyện.

```sql
create table prayer_reactions (
  id uuid primary key default gen_random_uuid(),
  prayer_id uuid references prayers(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  reaction_type text not null,
  created_at timestamptz default now(),
  unique(prayer_id, user_id, reaction_type)
);
```

Giá trị `reaction_type`:

- `pray`
- `peace`
- `candle`

---

## 5.6 `future_letters`

Thư gửi tương lai.

```sql
create table future_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  open_at timestamptz not null,
  opened_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 5.7 `memorials`

Góc tưởng nhớ.

```sql
create table memorials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  relationship text,
  birth_date date,
  death_date date,
  avatar_url text,
  message text,
  visibility text default 'private',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Giá trị `visibility`:

- `private`
- `public_link`

---

## 5.8 `memorial_candles`

Nến cho góc tưởng nhớ.

```sql
create table memorial_candles (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid references memorials(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  message text,
  created_at timestamptz default now()
);
```

---

## 5.9 `gratitude_entries`

Điều biết ơn.

```sql
create table gratitude_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  entry_date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 5.10 `reports`

Báo cáo nội dung vi phạm.

```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

# 6. Row Level Security Supabase

Bật RLS cho tất cả bảng có dữ liệu người dùng.

Yêu cầu policy cơ bản:

## `profiles`

- User được xem profile public.
- User chỉ được sửa profile của chính mình.

## `user_daily_messages`

- User chỉ xem/tạo record của chính mình.

## `prayers`

- Public đọc được prayer có `visibility = public_anonymous` và `status = active`.
- User đọc được prayer của chính mình.
- User tạo prayer của chính mình.
- User sửa/xóa prayer của chính mình.

## `prayer_reactions`

- User đã đăng nhập mới được reaction.
- User chỉ được xóa reaction của chính mình.
- Public có thể xem tổng số reaction, không cần xem danh tính user.

## `future_letters`

- User chỉ được CRUD thư của chính mình.

## `memorials`

- User xem/sửa/xóa memorial của chính mình.
- Public chỉ xem memorial có `visibility = public_link`.

## `gratitude_entries`

- User chỉ CRUD entry của chính mình.

## `reports`

- User đăng nhập được tạo report.
- Chỉ admin xem report.

---

# 7. API endpoints cần có

Tất cả API trả JSON.

Response format thống nhất:

```ts
{
  success: boolean;
  data?: any;
  error?: string;
}
```

---

## 7.1 Auth

Có thể dùng Supabase Auth trực tiếp ở frontend. Nếu cần route riêng:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

---

## 7.2 Daily Message

### `GET /api/daily-message/today`

Mục tiêu:

- Nếu user đã đăng nhập:
  - Kiểm tra hôm nay user đã mở thông điệp chưa.
  - Nếu rồi, trả lại thông điệp cũ.
  - Nếu chưa, chọn thông điệp hôm nay và lưu vào `user_daily_messages`.
- Nếu guest:
  - Trả về thông điệp demo hoặc thông điệp theo ngày nhưng không lưu streak.

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Có những điều không cần vội vàng.",
    "reflection_question": "Hôm nay bạn muốn buông bỏ điều gì?",
    "category": "peace",
    "opened_date": "2026-06-17"
  }
}
```

---

## 7.3 Prayers

### `GET /api/prayers`

Query:

- `type`
- `page`
- `limit`

Chỉ trả về prayer công khai, active.

### `POST /api/prayers`

Auth required.

Body:

```json
{
  "content": "Mong mẹ mau khỏe.",
  "type": "peace",
  "visibility": "public_anonymous",
  "allow_reactions": true
}
```

### `GET /api/prayers/:id`

Trả chi tiết prayer + reaction counts.

### `PATCH /api/prayers/:id`

Chỉ owner được sửa.

### `DELETE /api/prayers/:id`

Soft delete bằng cách set `status = deleted`.

### `POST /api/prayers/:id/reactions`

Auth required.

Body:

```json
{
  "reaction_type": "pray"
}
```

Nếu user đã reaction loại đó rồi thì không tạo trùng.

### `DELETE /api/prayers/:id/reactions`

Auth required.

Body:

```json
{
  "reaction_type": "pray"
}
```

---

## 7.4 Future Letters

### `GET /api/letters`

Auth required. Trả danh sách thư của user.

### `POST /api/letters`

Auth required.

Body:

```json
{
  "title": "Gửi mình sau 1 năm",
  "content": "Hy vọng lúc đó bạn đã ổn hơn.",
  "open_at": "2027-06-17T00:00:00.000Z"
}
```

### `GET /api/letters/:id`

Luật:

- Nếu chưa đến `open_at`, không trả `content`.
- Nếu đã đến `open_at`, trả content và có thể cập nhật `opened_at`.

Response khi chưa mở:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Gửi mình sau 1 năm",
    "is_locked": true,
    "open_at": "2027-06-17T00:00:00.000Z"
  }
}
```

### `DELETE /api/letters/:id`

Chỉ owner.

---

## 7.5 Memorials

### `GET /api/memorials`

Auth required. Trả danh sách memorial của user.

### `POST /api/memorials`

Auth required.

Body:

```json
{
  "name": "Ông ngoại",
  "relationship": "Ông ngoại",
  "birth_date": "1948-01-01",
  "death_date": "2025-01-01",
  "message": "Con luôn nhớ ông.",
  "visibility": "private"
}
```

### `GET /api/memorials/:id`

- Owner xem được.
- Public xem được nếu `visibility = public_link`.

### `PATCH /api/memorials/:id`

Owner only.

### `DELETE /api/memorials/:id`

Owner only.

### `POST /api/memorials/:id/candles`

Body:

```json
{
  "message": "Mong ông luôn bình an."
}
```

---

## 7.6 Gratitude

### `GET /api/gratitude`

Auth required.

Query:

- `month`
- `year`

### `POST /api/gratitude`

Auth required.

Body:

```json
{
  "content": "Cảm ơn vì hôm nay mình vẫn khỏe mạnh.",
  "entry_date": "2026-06-17"
}
```

### `PATCH /api/gratitude/:id`

Owner only.

### `DELETE /api/gratitude/:id`

Owner only.

---

## 7.7 Reports

### `POST /api/reports`

Auth required.

Body:

```json
{
  "target_type": "prayer",
  "target_id": "uuid",
  "reason": "Nội dung không phù hợp"
}
```

---

# 8. Cấu trúc thư mục đề xuất

```txt
src/
  app/
    page.tsx
    layout.tsx
    globals.css

    login/
      page.tsx
    register/
      page.tsx
    dashboard/
      page.tsx
    today/
      page.tsx
    prayers/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    sky/
      page.tsx
    letters/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    memorials/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    gratitude/
      page.tsx
      new/
        page.tsx
    privacy-policy/
      page.tsx
    terms/
      page.tsx
    community-guidelines/
      page.tsx

    api/
      daily-message/
        today/
          route.ts
      prayers/
        route.ts
        [id]/
          route.ts
          reactions/
            route.ts
      letters/
        route.ts
        [id]/
          route.ts
      memorials/
        route.ts
        [id]/
          route.ts
          candles/
            route.ts
      gratitude/
        route.ts
        [id]/
          route.ts
      reports/
        route.ts

  components/
    ui/
    layout/
      Navbar.tsx
      Footer.tsx
    cards/
      PrayerCard.tsx
      MessageCard.tsx
      MemorialCard.tsx
    forms/
      PrayerForm.tsx
      LetterForm.tsx
      MemorialForm.tsx
      GratitudeForm.tsx

  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    validations/
      prayer.ts
      letter.ts
      memorial.ts
      gratitude.ts
    utils.ts

  types/
    database.ts
    index.ts
```

---

# 9. Yêu cầu UI/UX

## Cảm giác tổng thể

- Bình yên.
- Gần gũi.
- Không u ám.
- Không quá mê tín.
- Không quá trẻ con.

## Màu sắc đề xuất

```txt
Background dark: #0F172A
Candle gold: #FBBF24
Cream: #FFF7ED
Soft green: #A7F3D0
Text dark: #1E293B
Text light: #F8FAFC
Muted: #94A3B8
```

## Font

- Có thể dùng Inter, Be Vietnam Pro hoặc system font.
- Nếu app hướng Việt Nam, ưu tiên font hỗ trợ tiếng Việt tốt.

## Component quan trọng

- Candle icon/card.
- Daily message card.
- Prayer card.
- Soft gradient background.
- Empty state thân thiện.
- Loading skeleton.
- Toast thông báo.

---

# 10. Nội dung mẫu seed data

Tạo sẵn một số daily messages:

```txt
Có những điều không cần vội vàng. Hôm nay, hãy cho bản thân được thở chậm lại một chút.

Bạn đã cố gắng nhiều hơn bạn nghĩ. Hãy dịu dàng với chính mình hôm nay.

Không phải ngày nào cũng phải thật mạnh mẽ. Có ngày chỉ cần bình an là đủ.

Điều gì hôm nay khiến bạn biết ơn?

Có những nỗi buồn sẽ nhẹ đi khi được gọi tên.

Bạn không cần phải mang mọi thứ một mình.

Một ngày mới không cần hoàn hảo, chỉ cần có một điều tốt đẹp.
```

Tạo sẵn một số lời nguyện public demo:

```txt
Mong mẹ sớm khỏe lại.
Hy vọng kỳ thi sắp tới thuận lợi.
Cảm ơn vì hôm nay gia đình vẫn bình an.
Mong những ai đang mệt mỏi sẽ tìm thấy một chút nhẹ lòng.
Nhớ ông ngoại, mong ông luôn an yên.
```

---

# 11. Bảo mật và kiểm duyệt

## Không được cho phép

- Nội dung xúc phạm cá nhân.
- Nội dung thù ghét.
- Nội dung kích động bạo lực.
- Nội dung cổ xúy tự hại.
- Nội dung mê tín cực đoan, lừa đảo tâm linh.
- Nội dung xin tiền, lừa đảo quyên góp.

## Cần có

- Nút báo cáo nội dung.
- Soft delete nội dung.
- Admin có thể ẩn prayer.
- Rate limit API tạo prayer/reaction để tránh spam.

MVP có thể rate limit đơn giản bằng middleware hoặc kiểm tra số lượng tạo trong ngày.

Ví dụ:

- Mỗi user tạo tối đa 10 prayers/ngày.
- Mỗi user tạo tối đa 20 gratitude entries/ngày.
- Mỗi user reaction tối đa 200 lần/ngày.

---

# 12. SEO và chia sẻ mạng xã hội

Cần tối ưu metadata cho các trang public:

- `/`
- `/prayers/[id]`
- `/messages/[date]`
- `/memorials/[id]` nếu public_link

Metadata cần có:

- Title
- Description
- Open Graph image
- Twitter card

Trang chia sẻ lời nguyện nên có title kiểu:

> Một lời nguyện đang được gửi trên Bình An

Không đưa nội dung quá riêng tư vào metadata nếu không cần.

---

# 13. Biến môi trường `.env.example`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Lưu ý:

- Không expose `SUPABASE_SERVICE_ROLE_KEY` ra client.
- Service role chỉ dùng trong server route cần quyền admin.

---

# 14. Checklist hoàn thành MVP

## Core

- [ ] Setup Next.js + TypeScript + Tailwind.
- [ ] Kết nối Supabase.
- [ ] Tạo schema SQL.
- [ ] Bật RLS.
- [ ] Tạo auth login/register.
- [ ] Tạo layout chính.
- [ ] Landing page hoàn chỉnh.

## Daily message

- [ ] API lấy thông điệp hôm nay.
- [ ] Không cho user đổi thông điệp trong cùng ngày.
- [ ] Trang `/today`.

## Prayer

- [ ] Tạo lời nguyện.
- [ ] Danh sách lời nguyện public.
- [ ] Chi tiết lời nguyện.
- [ ] Reaction: đồng nguyện, gửi an lành, thắp nến.
- [ ] Báo cáo nội dung.

## Future letter

- [ ] Tạo thư tương lai.
- [ ] Danh sách thư.
- [ ] Không cho mở thư trước ngày.
- [ ] Cho mở thư khi đến ngày.

## Memorial

- [ ] Tạo góc tưởng nhớ.
- [ ] Danh sách góc tưởng nhớ.
- [ ] Chi tiết góc tưởng nhớ.
- [ ] Thắp nến tưởng nhớ.

## Gratitude

- [ ] Tạo điều biết ơn.
- [ ] Danh sách điều biết ơn.
- [ ] Lọc theo tháng.

## Policy

- [ ] Privacy Policy.
- [ ] Terms.
- [ ] Community Guidelines.

## Production

- [ ] Responsive mobile.
- [ ] Loading state.
- [ ] Error state.
- [ ] Empty state.
- [ ] Validate form bằng Zod.
- [ ] SEO metadata.
- [ ] Deploy Vercel.

---

# 15. Ưu tiên phát triển theo giai đoạn

## Giai đoạn 1: MVP web + API

Làm trước:

1. Landing page.
2. Auth.
3. Thông điệp hôm nay.
4. Lời nguyện + đồng nguyện.
5. Web public share.
6. Policy pages.

Mục tiêu:

- Có bản web chạy được.
- API đủ để app mobile dùng sau.
- Có link chia sẻ public.

## Giai đoạn 2

Thêm:

1. Thư tương lai.
2. Biết ơn hằng ngày.
3. Góc tưởng nhớ.
4. Streak.
5. Notification logic chuẩn bị cho mobile.

## Giai đoạn 3

Thêm:

1. Premium.
2. Xuất PDF.
3. Theme cao cấp.
4. Admin dashboard.
5. Push notification.
6. Mobile app Android.

---

# 16. Yêu cầu chất lượng code

- Code rõ ràng, dễ đọc.
- Tách component hợp lý.
- Không hardcode secret.
- Có validation cho tất cả API body.
- Có xử lý lỗi rõ ràng.
- Không để API trả stack trace.
- Component responsive tốt trên mobile.
- TypeScript không dùng `any` bừa bãi.
- Các route private phải check auth.
- Không cho user sửa/xóa dữ liệu của người khác.

---

# 17. Prompt dành cho Codex/IDE

Hãy xây dựng hoàn chỉnh MVP web + API cho sản phẩm “Bình An” theo tài liệu này.

Yêu cầu:

1. Dùng Next.js App Router + TypeScript + Tailwind CSS.
2. Dùng Supabase cho Auth, Database, Storage.
3. Tạo đầy đủ các page và API route đã mô tả.
4. Tạo schema SQL Supabase trong file riêng, ví dụ `supabase/schema.sql`.
5. Tạo `.env.example`.
6. Viết code sạch, có validation bằng Zod.
7. Tạo UI responsive, nhẹ nhàng, hiện đại, phù hợp sản phẩm Bình An.
8. Đảm bảo các chức năng MVP chạy được:
   - Đăng ký/đăng nhập.
   - Mở thông điệp hôm nay.
   - Tạo lời nguyện.
   - Xem bầu trời lời nguyện.
   - Đồng nguyện/gửi an lành/thắp nến.
   - Viết thư tương lai.
   - Tạo điều biết ơn.
   - Tạo góc tưởng nhớ.
9. Viết README hướng dẫn setup local và deploy.
10. Ưu tiên hoàn thiện bản chạy được hơn là làm animation phức tạp.
---

# Binh An MVP setup

Day la ban Next.js App Router + TypeScript + Tailwind + Supabase cho san pham Binh An, duoc scaffold tu tai lieu yeu cau trong README nay.

## Setup local

1. Cai dependencies:

```bash
npm install
```

2. Tao file moi truong:

```bash
cp .env.example .env.local
```

3. Dien cac bien Supabase:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Chay SQL trong `supabase/schema.sql` tren Supabase SQL Editor.

5. Chay dev server:

```bash
npm run dev
```

6. Kiem tra truoc deploy:

```bash
npm run typecheck
npm run build
```

## Deploy Vercel

Ket noi repo len Vercel, them cac bien moi truong nhu `.env.example`, va deploy. Khong dua `SUPABASE_SERVICE_ROLE_KEY` vao client-side code.


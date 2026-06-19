import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().trim().min(2, "Tên hiển thị cần ít nhất 2 ký tự.").max(80, "Tên hiển thị tối đa 80 ký tự."),
  bio: z.string().trim().max(500, "Giới thiệu tối đa 500 ký tự.").nullable(),
  avatar_url: z.string().trim().url("URL ảnh đại diện không hợp lệ.").nullable()
});

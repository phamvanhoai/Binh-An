import { z } from "zod";
import { getAdminOrError } from "@/lib/admin";
import { dbQuery } from "@/lib/db";
import { fail, ok } from "@/lib/utils";

const schema = z.object({
  message: z.string().trim().min(2).max(1000),
  reflection_question: z.string().trim().max(500).nullable().optional(),
  category: z.string().trim().min(2).max(50),
  active_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional()
});

export async function POST(request: Request) {
  const admin = await getAdminOrError();
  if ("response" in admin) return admin.response;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ.");

  try {
    const result = await dbQuery(
      `insert into public.daily_messages (message, reflection_question, category, active_date, is_active)
       values ($1, $2, $3, $4, true) returning *`,
      [
        parsed.data.message,
        parsed.data.reflection_question || null,
        parsed.data.category,
        parsed.data.active_date || null
      ]
    );
    return ok(result.rows[0], { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Không thể tạo thông điệp.", 500);
  }
}

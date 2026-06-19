import { z } from "zod";
import { getAdminOrError } from "@/lib/admin";
import { dbQuery } from "@/lib/db";
import { fail, ok } from "@/lib/utils";

const schema = z.union([
  z.object({ is_active: z.boolean() }),
  z.object({
    message: z.string().trim().min(2).max(1000),
    reflection_question: z.string().trim().max(500).nullable().optional(),
    category: z.string().trim().min(2).max(50),
    active_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional()
  })
]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrError();
  if ("response" in admin) return admin.response;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ.");
  const { id } = await context.params;

  try {
    const result = "is_active" in parsed.data
      ? await dbQuery(
          "update public.daily_messages set is_active = $1 where id = $2 returning *",
          [parsed.data.is_active, id]
        )
      : await dbQuery(
          `update public.daily_messages
           set message = $1, reflection_question = $2, category = $3, active_date = $4
           where id = $5 returning *`,
          [
            parsed.data.message,
            parsed.data.reflection_question || null,
            parsed.data.category,
            parsed.data.active_date || null,
            id
          ]
        );

    if (!result.rowCount) return fail("Không tìm thấy thông điệp.", 404);
    return ok(result.rows[0]);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Không thể cập nhật thông điệp.", 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrError();
  if ("response" in admin) return admin.response;
  const { id } = await context.params;

  try {
    const usage = await dbQuery<{ count: string }>(
      "select count(*)::text as count from public.user_daily_messages where message_id = $1",
      [id]
    );
    if (Number(usage.rows[0]?.count || 0) > 0) {
      return fail("Thông điệp đã có lịch sử người dùng mở. Hãy tắt thay vì xóa.", 409);
    }

    const result = await dbQuery(
      "delete from public.daily_messages where id = $1 returning id",
      [id]
    );
    if (!result.rowCount) return fail("Không tìm thấy thông điệp.", 404);
    return ok({ id });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Không thể xóa thông điệp.", 500);
  }
}

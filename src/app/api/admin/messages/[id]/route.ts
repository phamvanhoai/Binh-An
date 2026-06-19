import { z } from "zod";
import { getAdminOrError } from "@/lib/admin";
import { dbQuery } from "@/lib/db";
import { fail, ok } from "@/lib/utils";

const schema = z.object({ is_active: z.boolean() });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrError();
  if ("response" in admin) return admin.response;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Trạng thái không hợp lệ.");
  const { id } = await context.params;

  const result = await dbQuery(
    "update public.daily_messages set is_active = $1 where id = $2 returning *",
    [parsed.data.is_active, id]
  );
  if (!result.rowCount) return fail("Không tìm thấy thông điệp.", 404);
  return ok(result.rows[0]);
}

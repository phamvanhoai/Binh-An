import { z } from "zod";
import { getAdminOrError } from "@/lib/admin";
import { dbQuery } from "@/lib/db";
import { fail, ok } from "@/lib/utils";

const schema = z.object({ status: z.enum(["active", "hidden", "deleted"]) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrError();
  if ("response" in admin) return admin.response;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Trạng thái không hợp lệ.");
  const { id } = await context.params;

  const result = await dbQuery(
    "update public.prayers set status = $1, updated_at = now() where id = $2 returning *",
    [parsed.data.status, id]
  );
  if (!result.rowCount) return fail("Không tìm thấy lời bình an.", 404);
  return ok(result.rows[0]);
}

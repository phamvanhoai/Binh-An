import { z } from "zod";
import { getAdminOrError } from "@/lib/admin";
import { dbQuery } from "@/lib/db";
import { fail, ok } from "@/lib/utils";

const schema = z.object({ admin: z.boolean() });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const currentAdmin = await getAdminOrError();
  if ("response" in currentAdmin) return currentAdmin.response;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Quyền không hợp lệ.");
  const { id } = await context.params;
  if (id === currentAdmin.user.id && !parsed.data.admin) return fail("Bạn không thể tự gỡ quyền admin.", 400);

  if (parsed.data.admin) {
    await dbQuery("insert into public.admin_users (user_id) values ($1) on conflict do nothing", [id]);
  } else {
    const count = await dbQuery<{ count: string }>("select count(*)::text as count from public.admin_users");
    if (Number(count.rows[0]?.count || 0) <= 1) return fail("Hệ thống phải còn ít nhất một admin.", 400);
    await dbQuery("delete from public.admin_users where user_id = $1", [id]);
  }

  return ok({ user_id: id, admin: parsed.data.admin });
}

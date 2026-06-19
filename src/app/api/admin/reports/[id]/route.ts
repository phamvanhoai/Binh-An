import { z } from "zod";
import { getAdminOrError } from "@/lib/admin";
import { dbQuery } from "@/lib/db";
import { fail, ok } from "@/lib/utils";

const schema = z.object({
  status: z.enum(["pending", "resolved", "dismissed"]),
  hide_target: z.boolean().optional()
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrError();
  if ("response" in admin) return admin.response;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail("Trạng thái không hợp lệ.");
  const { id } = await context.params;

  const result = await dbQuery(
    `with report_row as (
       update public.reports
       set status = $1, updated_at = now()
       where id = $2
       returning *
     ),
     hidden_prayer as (
       update public.prayers
       set status = 'hidden', updated_at = now()
       where $3 = true
         and id = (select target_id from report_row where target_type = 'prayer')
       returning id
     )
     select * from report_row`,
    [parsed.data.status, id, parsed.data.hide_target === true]
  );
  if (!result.rowCount) return fail("Không tìm thấy báo cáo.", 404);
  return ok(result.rows[0]);
}

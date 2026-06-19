import { z } from "zod";
import { getAdminOrError } from "@/lib/admin";
import { dbQuery } from "@/lib/db";
import { fail, ok } from "@/lib/utils";

const schema = z.object({
  allow_registration: z.boolean(),
  public_community_enabled: z.boolean(),
  moderate_new_prayers: z.boolean(),
  community_page_size: z.number().int().min(4).max(30),
  support_email: z.union([z.literal(""), z.string().email()])
});

export async function PATCH(request: Request) {
  const admin = await getAdminOrError();
  if ("response" in admin) return admin.response;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Cấu hình không hợp lệ.");

  const result = await dbQuery(
    `insert into public.site_settings (
       id, allow_registration, public_community_enabled, moderate_new_prayers,
       community_page_size, support_email, updated_at, updated_by
     )
     values (true, $1, $2, $3, $4, $5, now(), $6)
     on conflict (id) do update set
       allow_registration = excluded.allow_registration,
       public_community_enabled = excluded.public_community_enabled,
       moderate_new_prayers = excluded.moderate_new_prayers,
       community_page_size = excluded.community_page_size,
       support_email = excluded.support_email,
       updated_at = now(),
       updated_by = excluded.updated_by
     returning *`,
    [
      parsed.data.allow_registration,
      parsed.data.public_community_enabled,
      parsed.data.moderate_new_prayers,
      parsed.data.community_page_size,
      parsed.data.support_email || null,
      admin.user.id
    ]
  );

  return ok(result.rows[0]);
}

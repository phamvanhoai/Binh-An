import { z } from "zod";
import { getAdminOrError } from "@/lib/admin";
import { dbQuery } from "@/lib/db";
import { fail, ok } from "@/lib/utils";

const originSchema = z.union([
  z.literal("*"),
  z.string().url().refine((value) => value.startsWith("http://") || value.startsWith("https://"))
]);

const schema = z.object({
  api_enabled: z.boolean(),
  api_maintenance: z.boolean(),
  api_maintenance_message: z.string().trim().min(3).max(300),
  api_allowed_origins: z.array(originSchema).min(1).max(50),
  api_rate_limit_per_minute: z.number().int().min(10).max(5000)
});

export async function PATCH(request: Request) {
  const admin = await getAdminOrError();
  if ("response" in admin) return admin.response;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Cấu hình API không hợp lệ.");

  const result = await dbQuery(
    `update public.site_settings set
       api_enabled = $1,
       api_maintenance = $2,
       api_maintenance_message = $3,
       api_allowed_origins = $4,
       api_rate_limit_per_minute = $5,
       updated_at = now(),
       updated_by = $6
     where id = true
     returning *`,
    [
      parsed.data.api_enabled,
      parsed.data.api_maintenance,
      parsed.data.api_maintenance_message,
      parsed.data.api_allowed_origins,
      parsed.data.api_rate_limit_per_minute,
      admin.user.id
    ]
  );

  return ok(result.rows[0]);
}

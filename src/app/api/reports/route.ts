import { getUserOrError } from "@/lib/auth";
import { reportSchema } from "@/lib/validations/report";
import { fail, ok } from "@/lib/utils";

export async function POST(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = reportSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  const { data, error } = await auth.supabase
    .from("reports")
    .insert({ ...parsed.data, reporter_id: auth.user.id })
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data, { status: 201 });
}

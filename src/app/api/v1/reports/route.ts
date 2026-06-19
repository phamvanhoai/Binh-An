import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { reportSchema } from "@/lib/validations/report";

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const parsed = reportSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid report data.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("reports")
    .insert({ ...parsed.data, reporter_id: auth.user.id })
    .select()
    .single();
  if (error) return apiError("REPORT_CREATE_FAILED", error.message, 500);
  return apiResponse(data, { status: 201 });
}

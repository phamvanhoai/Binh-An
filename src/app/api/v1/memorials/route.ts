import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { memorialSchema } from "@/lib/validations/memorial";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase
    .from("memorials")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });
  if (error) return apiError("MEMORIALS_READ_FAILED", error.message, 500);
  return apiResponse(data || []);
}

export async function POST(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const parsed = memorialSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid memorial data.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("memorials")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select()
    .single();
  if (error) return apiError("MEMORIAL_CREATE_FAILED", error.message, 500);
  return apiResponse(data, { status: 201 });
}

import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { gratitudeSchema } from "@/lib/validations/gratitude";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const url = new URL(request.url);
  const month = url.searchParams.get("month");
  const year = url.searchParams.get("year");
  let query = auth.supabase
    .from("gratitude_entries")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("entry_date", { ascending: false });

  if (month && year) {
    const numericMonth = Number(month);
    const numericYear = Number(year);
    if (numericMonth < 1 || numericMonth > 12 || numericYear < 2000 || numericYear > 2200) {
      return apiError("VALIDATION_ERROR", "Month or year is invalid.", 422);
    }
    const start = `${numericYear}-${String(numericMonth).padStart(2, "0")}-01`;
    const end = new Date(Date.UTC(numericYear, numericMonth, 0)).toISOString().slice(0, 10);
    query = query.gte("entry_date", start).lte("entry_date", end);
  }

  const { data, error } = await query;
  if (error) return apiError("GRATITUDE_READ_FAILED", error.message, 500);
  return apiResponse(data || []);
}

export async function POST(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const parsed = gratitudeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid gratitude entry.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("gratitude_entries")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select()
    .single();
  if (error) return apiError("GRATITUDE_CREATE_FAILED", error.message, 500);
  return apiResponse(data, { status: 201 });
}

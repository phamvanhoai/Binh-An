import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { letterSchema } from "@/lib/validations/letter";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const { data, error } = await auth.supabase
    .from("future_letters")
    .select("id,title,open_at,opened_at,created_at")
    .eq("user_id", auth.user.id)
    .order("open_at", { ascending: true });
  if (error) return apiError("LETTERS_READ_FAILED", error.message, 500);
  return apiResponse((data || []).map((letter) => ({
    ...letter,
    is_locked: new Date(letter.open_at).getTime() > Date.now()
  })));
}

export async function POST(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;
  const parsed = letterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid future letter.", 422, parsed.error.flatten());
  }
  if (new Date(parsed.data.open_at).getTime() <= Date.now()) {
    return apiError("OPEN_DATE_INVALID", "The open date must be in the future.", 422);
  }

  const { data, error } = await auth.supabase
    .from("future_letters")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select()
    .single();
  if (error) return apiError("LETTER_CREATE_FAILED", error.message, 500);
  return apiResponse(data, { status: 201 });
}

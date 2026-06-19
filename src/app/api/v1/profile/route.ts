import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";
import { profileSchema } from "@/lib/validations/profile";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("profiles")
    .select("display_name,bio,avatar_url,created_at,updated_at")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (error) return apiError("PROFILE_READ_FAILED", error.message, 500);

  return apiResponse({
    id: auth.user.id,
    email: auth.user.email,
    display_name: data?.display_name || auth.user.user_metadata?.name || "",
    bio: data?.bio || "",
    avatar_url: data?.avatar_url || auth.user.user_metadata?.avatar_url || "",
    created_at: data?.created_at || auth.user.created_at,
    updated_at: data?.updated_at || null
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse({
    display_name: body?.display_name,
    bio: body?.bio || null,
    avatar_url: body?.avatar_url || null
  });
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid profile data.", 422, parsed.error.flatten());
  }

  const { data, error } = await auth.supabase
    .from("profiles")
    .upsert({
      id: auth.user.id,
      ...parsed.data,
      updated_at: new Date().toISOString()
    })
    .select("display_name,bio,avatar_url,created_at,updated_at")
    .single();
  if (error) return apiError("PROFILE_UPDATE_FAILED", error.message, 500);

  await auth.supabase.auth.updateUser({
    data: {
      name: parsed.data.display_name,
      avatar_url: parsed.data.avatar_url
    }
  });

  return apiResponse(data);
}

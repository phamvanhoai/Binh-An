import { apiError, apiOptions, apiResponse, requireAppAuth } from "@/lib/api-v1";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSize = 5 * 1024 * 1024;

export function OPTIONS() {
  return apiOptions();
}

export async function POST(request: Request) {
  const auth = await requireAppAuth(request);
  if ("response" in auth) return auth.response;

  const formData = await request.formData();
  const avatar = formData.get("avatar");
  if (!(avatar instanceof File)) {
    return apiError("AVATAR_MISSING", "Avatar file is required.", 422);
  }
  if (!allowedTypes.has(avatar.type)) {
    return apiError("AVATAR_TYPE_INVALID", "Only JPG, PNG and WebP are supported.", 422);
  }
  if (avatar.size > maxSize) {
    return apiError("AVATAR_TOO_LARGE", "Avatar must not exceed 5MB.", 422);
  }

  const extension = avatar.type === "image/png" ? "png" : avatar.type === "image/webp" ? "webp" : "jpg";
  const path = `${auth.user.id}/avatar.${extension}`;
  const { error } = await auth.supabase.storage.from("avatars").upload(path, avatar, {
    contentType: avatar.type,
    cacheControl: "3600",
    upsert: true
  });
  if (error) return apiError("AVATAR_UPLOAD_FAILED", error.message, 500);

  const { data } = auth.supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;
  const { error: profileError } = await auth.supabase.from("profiles").upsert({
    id: auth.user.id,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString()
  });
  if (profileError) return apiError("PROFILE_UPDATE_FAILED", profileError.message, 500);

  return apiResponse({ avatar_url: avatarUrl });
}

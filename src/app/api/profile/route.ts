import { getUserOrError } from "@/lib/auth";
import { fail, ok } from "@/lib/utils";
import { profileSchema } from "@/lib/validations/profile";

const avatarTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxAvatarSize = 5 * 1024 * 1024;

export async function GET() {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from("profiles")
    .select("display_name,bio,avatar_url,created_at,updated_at")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (error) return fail(error.message, 500);

  return ok({
    email: auth.user.email,
    display_name: data?.display_name || auth.user.user_metadata?.name || "",
    bio: data?.bio || "",
    avatar_url: data?.avatar_url || auth.user.user_metadata?.avatar_url || "",
    created_at: data?.created_at || auth.user.created_at,
    updated_at: data?.updated_at || null
  });
}

export async function PATCH(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const body = await request.json();
  const parsed = profileSchema.safeParse({
    display_name: body.display_name,
    bio: body.bio || null,
    avatar_url: body.avatar_url || null
  });

  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Dữ liệu hồ sơ không hợp lệ.");

  const updatedAt = new Date().toISOString();
  const { data, error } = await auth.supabase
    .from("profiles")
    .upsert(
      {
        id: auth.user.id,
        ...parsed.data,
        updated_at: updatedAt
      },
      { onConflict: "id" }
    )
    .select("display_name,bio,avatar_url,created_at,updated_at")
    .single();

  if (error) return fail(error.message, 500);

  await auth.supabase.auth.updateUser({
    data: {
      name: parsed.data.display_name,
      avatar_url: parsed.data.avatar_url
    }
  });

  return ok(data);
}

export async function POST(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const formData = await request.formData();
  const avatar = formData.get("avatar");

  if (!(avatar instanceof File)) return fail("Vui lòng chọn một ảnh đại diện.");
  if (!avatarTypes.has(avatar.type)) return fail("Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WebP.");
  if (avatar.size > maxAvatarSize) return fail("Ảnh đại diện không được vượt quá 5MB.");

  const extension = avatar.type === "image/png" ? "png" : avatar.type === "image/webp" ? "webp" : "jpg";
  const path = `${auth.user.id}/avatar.${extension}`;
  const { error } = await auth.supabase.storage.from("avatars").upload(path, avatar, {
    contentType: avatar.type,
    cacheControl: "3600",
    upsert: true
  });

  if (error) return fail(error.message, 500);

  const { data } = auth.supabase.storage.from("avatars").getPublicUrl(path);
  return ok({ avatar_url: `${data.publicUrl}?v=${Date.now()}` });
}

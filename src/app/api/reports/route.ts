import { getUserOrError } from "@/lib/auth";
import { reportSchema } from "@/lib/validations/report";
import { fail, ok } from "@/lib/utils";

export async function POST(request: Request) {
  const auth = await getUserOrError();
  if ("response" in auth) return auth.response;

  const parsed = reportSchema.safeParse(await request.json());
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Invalid payload");

  if (parsed.data.target_type === "prayer") {
    const { data: prayer, error: prayerError } = await auth.supabase
      .from("prayers")
      .select("id,user_id,visibility,status")
      .eq("id", parsed.data.target_id)
      .maybeSingle();

    if (prayerError) return fail(prayerError.message, 500);
    if (!prayer || prayer.visibility !== "public_anonymous" || prayer.status !== "active") {
      return fail("Lời bình an không tồn tại hoặc không còn công khai.", 404);
    }
    if (prayer.user_id === auth.user.id) return fail("Bạn không thể báo cáo nội dung của chính mình.");
  }

  const { data: existing, error: existingError } = await auth.supabase
    .from("reports")
    .select("id")
    .eq("reporter_id", auth.user.id)
    .eq("target_type", parsed.data.target_type)
    .eq("target_id", parsed.data.target_id)
    .eq("status", "pending")
    .maybeSingle();

  if (existingError) return fail(existingError.message, 500);
  if (existing) return fail("Bạn đã báo cáo nội dung này và báo cáo đang được xem xét.", 409);

  const { data, error } = await auth.supabase
    .from("reports")
    .insert({ ...parsed.data, reporter_id: auth.user.id })
    .select()
    .single();

  if (error) return fail(error.message, 500);
  return ok(data, { status: 201 });
}

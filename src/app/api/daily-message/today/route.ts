import { demoMessages } from "@/lib/demo-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { fail, ok, todayKey } from "@/lib/utils";

export async function GET() {
  if (!hasSupabaseEnv()) {
    return ok({ ...demoMessages[0], opened_date: todayKey() });
  }

  const supabase = await createClient();
  const openedDate = todayKey();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from("user_daily_messages")
      .select("opened_date, daily_messages(id, message, reflection_question, category)")
      .eq("user_id", user.id)
      .eq("opened_date", openedDate)
      .maybeSingle();

    if (existing?.daily_messages) {
      return ok({ ...existing.daily_messages, opened_date: existing.opened_date });
    }
  }

  const { data: datedMessage } = await supabase
    .from("daily_messages")
    .select("id, message, reflection_question, category")
    .eq("is_active", true)
    .eq("active_date", openedDate)
    .maybeSingle();

  const { data: fallbackMessage } = datedMessage
    ? { data: null }
    : await supabase.from("daily_messages").select("id, message, reflection_question, category").eq("is_active", true).limit(1).maybeSingle();

  const message = datedMessage || fallbackMessage;
  if (!message) {
    return fail("No daily message is configured.", 404);
  }

  if (user) {
    await supabase.from("user_daily_messages").insert({
      user_id: user.id,
      message_id: message.id,
      opened_date: openedDate
    });
  }

  return ok({ ...message, opened_date: openedDate });
}

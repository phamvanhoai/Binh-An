import {
  apiError,
  apiOptions,
  apiResponse,
  createAppClient,
  getBearerToken,
  requireAppAuth
} from "@/lib/api-v1";
import { todayKey } from "@/lib/utils";

export function OPTIONS() {
  return apiOptions();
}

export async function GET(request: Request) {
  const token = getBearerToken(request);
  const auth = token ? await requireAppAuth(request) : null;
  if (auth && "response" in auth) return auth.response;

  const supabase = auth && !("response" in auth) ? auth.supabase : createAppClient();
  const openedDate = todayKey();

  if (auth && !("response" in auth)) {
    const { data: existing } = await supabase
      .from("user_daily_messages")
      .select("opened_date, daily_messages(id,message,reflection_question,category)")
      .eq("user_id", auth.user.id)
      .eq("opened_date", openedDate)
      .maybeSingle();

    const existingMessage = Array.isArray(existing?.daily_messages)
      ? existing.daily_messages[0]
      : existing?.daily_messages;
    if (existingMessage) {
      return apiResponse({ ...existingMessage, opened_date: existing?.opened_date });
    }
  }

  const { data: datedMessage } = await supabase
    .from("daily_messages")
    .select("id,message,reflection_question,category")
    .eq("is_active", true)
    .eq("active_date", openedDate)
    .maybeSingle();

  const { data: fallbackMessage } = datedMessage
    ? { data: null }
    : await supabase
        .from("daily_messages")
        .select("id,message,reflection_question,category")
        .eq("is_active", true)
        .is("active_date", null)
        .limit(1)
        .maybeSingle();

  const message = datedMessage || fallbackMessage;
  if (!message) return apiError("DAILY_MESSAGE_NOT_FOUND", "No active daily message is configured.", 404);

  if (auth && !("response" in auth)) {
    await supabase.from("user_daily_messages").upsert(
      {
        user_id: auth.user.id,
        message_id: message.id,
        opened_date: openedDate
      },
      { onConflict: "user_id,opened_date" }
    );
  }

  return apiResponse({ ...message, opened_date: openedDate });
}

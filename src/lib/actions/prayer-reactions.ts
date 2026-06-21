"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

const reactionTypes = new Set(["pray", "peace", "candle"]);

export async function togglePrayerReaction(formData: FormData) {
  if (!hasSupabaseEnv()) return;

  const prayerId = String(formData.get("prayer_id") || "");
  const reactionType = String(formData.get("reaction_type") || "pray");
  const returnPath = String(formData.get("return_path") || "/prayers");

  if (!prayerId || !reactionTypes.has(reactionType)) return;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(returnPath)}`);
  }

  const { data: prayer, error: prayerError } = await supabase
    .from("prayers")
    .select("id,user_id,visibility,status,allow_reactions")
    .eq("id", prayerId)
    .maybeSingle();

  if (
    prayerError ||
    !prayer ||
    prayer.user_id === user.id ||
    prayer.visibility !== "public_anonymous" ||
    prayer.status !== "active" ||
    !prayer.allow_reactions
  ) {
    return;
  }

  const { data: existing, error: existingError } = await supabase
    .from("prayer_reactions")
    .select("id")
    .eq("prayer_id", prayerId)
    .eq("user_id", user.id)
    .eq("reaction_type", reactionType)
    .maybeSingle();

  if (existingError) return;

  if (existing) {
    await supabase.from("prayer_reactions").delete().eq("id", existing.id).eq("user_id", user.id);
  } else {
    await supabase.from("prayer_reactions").insert({
      prayer_id: prayerId,
      user_id: user.id,
      reaction_type: reactionType
    });
  }

  revalidatePath("/prayers");
  revalidatePath(`/prayers/${prayerId}`);
  revalidatePath("/");
  revalidatePath("/profile");
}

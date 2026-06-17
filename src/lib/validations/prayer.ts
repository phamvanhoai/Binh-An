import { z } from "zod";

export const prayerSchema = z.object({
  content: z.string().trim().min(3).max(1000),
  type: z.enum(["wish", "gratitude", "memorial", "worry", "peace"]),
  visibility: z.enum(["private", "public_anonymous"]).default("public_anonymous"),
  allow_reactions: z.boolean().default(true)
});

export const prayerPatchSchema = prayerSchema.partial();

export const reactionSchema = z.object({
  reaction_type: z.enum(["pray", "peace", "candle"])
});

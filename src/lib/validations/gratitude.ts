import { z } from "zod";

export const gratitudeSchema = z.object({
  content: z.string().trim().min(2).max(1000),
  entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

export const gratitudePatchSchema = gratitudeSchema.partial();

import { z } from "zod";

export const reportSchema = z.object({
  target_type: z.enum(["prayer", "memorial", "gratitude"]),
  target_id: z.string().uuid(),
  reason: z.string().trim().min(4).max(500)
});

import { z } from "zod";

export const letterSchema = z.object({
  title: z.string().trim().min(2).max(120),
  content: z.string().trim().min(5).max(8000),
  open_at: z.string().datetime()
});

import { z } from "zod";

const optionalDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable();

export const memorialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  relationship: z.string().trim().max(80).optional().nullable(),
  birth_date: optionalDate,
  death_date: optionalDate,
  avatar_url: z.string().url().optional().nullable(),
  message: z.string().trim().max(1500).optional().nullable(),
  visibility: z.enum(["private", "public_link"]).default("private")
});

export const memorialPatchSchema = memorialSchema.partial();

export const candleSchema = z.object({
  message: z.string().trim().max(500).optional().nullable()
});

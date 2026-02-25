import { z } from "zod";

export const analyzeWebAppSchema = z.object({
  url: z
    .string()
    .trim()
    .url()
    .refine((value) => /^https?:\/\//i.test(value), "URL must start with http:// or https://")
});

export const listReportsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  page: z.coerce.number().int().min(1).default(1),
  search: z.string().trim().max(500).optional().default(""),
  severity: z.enum(["High", "Medium", "Low"]).optional()
});

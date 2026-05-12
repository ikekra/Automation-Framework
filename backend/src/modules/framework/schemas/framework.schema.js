import { z } from "zod";

export const generateFrameworkSchema = z.object({
  language: z.string().trim().min(2).max(50),
  automationTool: z.string().trim().min(2).max(80),
  pattern: z.string().trim().min(2).max(80),
  testRunner: z.string().trim().min(2).max(80),
  cicd: z.string().trim().min(2).max(80),
  dockerSupport: z.boolean()
});

export const listFrameworksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

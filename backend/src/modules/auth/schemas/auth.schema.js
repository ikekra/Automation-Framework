import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,72}$/;

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().regex(passwordRegex, {
    message: "Password must be 8-72 chars and include upper, lower, number, and special character"
  })
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20).optional()
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(20).optional()
});

import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,72}$/;

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().regex(passwordRegex, {
    message: "Password must be 8-72 chars and include upper, lower, number, and special character"
  }),
  organization: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  plan: z.enum(["Starter", "Pro", "Enterprise"]).optional()
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1)
});

export const requestOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email()
});

export const loginOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  otp: z.string().min(4).max(8),
  totp: z.string().min(4).max(8).optional()
});

export const verifyEmailSchema = z.object({
  token: z.string().min(12)
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().toLowerCase().email()
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20).optional()
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(20).optional()
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  organization: z.string().trim().max(160).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
  plan: z.enum(["Starter", "Pro", "Enterprise"]).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().regex(passwordRegex, {
    message: "Password must be 8-72 chars and include upper, lower, number, and special character"
  })
});

export const totpSetupSchema = z.object({});

export const totpVerifySchema = z.object({
  token: z.string().min(6).max(8)
});

export const totpDisableSchema = z.object({
  token: z.string().min(6).max(8)
});

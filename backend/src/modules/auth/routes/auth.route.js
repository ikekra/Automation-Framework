import { Router } from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { validate } from "../../../middleware/validate.js";
import { authenticate, authorizeRoles } from "../../../middleware/auth.js";
import { authRateLimiter } from "../../../middleware/rateLimiter.js";
import {
  changePasswordSchema,
  loginOtpSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  requestOtpSchema,
  resendVerificationSchema,
  totpDisableSchema,
  totpVerifySchema,
  updateProfileSchema,
  verifyEmailSchema
} from "../schemas/auth.schema.js";
import {
  changePassword,
  disableTwoFactor,
  login,
  loginOtp,
  logout,
  refresh,
  register,
  requestOtp,
  resendVerification,
  setupTwoFactor,
  updateProfile,
  verifyEmail,
  verifyTwoFactor
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), asyncHandler(register));
router.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(login));
router.post("/login-otp", authRateLimiter, validate(loginOtpSchema), asyncHandler(loginOtp));
router.post("/request-otp", authRateLimiter, validate(requestOtpSchema), asyncHandler(requestOtp));
router.post("/verify-email", validate(verifyEmailSchema), asyncHandler(verifyEmail));
router.post("/resend-verification", validate(resendVerificationSchema), asyncHandler(resendVerification));
router.post("/refresh", authRateLimiter, validate(refreshSchema), asyncHandler(refresh));
router.post("/logout", validate(logoutSchema), asyncHandler(logout));
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({ success: true, data: req.auth });
});
router.patch("/profile", authenticate, validate(updateProfileSchema), asyncHandler(updateProfile));
router.patch("/password", authenticate, validate(changePasswordSchema), asyncHandler(changePassword));
router.post("/2fa/setup", authenticate, asyncHandler(setupTwoFactor));
router.post("/2fa/verify", authenticate, validate(totpVerifySchema), asyncHandler(verifyTwoFactor));
router.post("/2fa/disable", authenticate, validate(totpDisableSchema), asyncHandler(disableTwoFactor));
router.get("/admin-check", authenticate, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ success: true, message: "Admin access granted" });
});

export default router;

import { Router } from "express";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { validate } from "../../../middleware/validate.js";
import { authenticate, authorizeRoles } from "../../../middleware/auth.js";
import { authRateLimiter } from "../../../middleware/rateLimiter.js";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "../schemas/auth.schema.js";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), asyncHandler(register));
router.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(login));
router.post("/refresh", authRateLimiter, validate(refreshSchema), asyncHandler(refresh));
router.post("/logout", validate(logoutSchema), asyncHandler(logout));
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({ success: true, data: req.auth });
});
router.get("/admin-check", authenticate, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ success: true, message: "Admin access granted" });
});

export default router;

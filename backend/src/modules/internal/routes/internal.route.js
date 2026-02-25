import { Router } from "express";
import { authenticate, authorizeRoles } from "../../../middleware/auth.js";
import { internalSelfTestRateLimiter } from "../../../middleware/rateLimiter.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { runSelfTestController } from "../controllers/internal.controller.js";

const router = Router();

router.use(authenticate, authorizeRoles("admin"));
router.post("/self-test", internalSelfTestRateLimiter, asyncHandler(runSelfTestController));

export default router;

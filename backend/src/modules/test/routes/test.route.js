import express, { Router } from "express";
import path from "node:path";
import { authenticate } from "../../../middleware/auth.js";
import { testAnalyzeRateLimiter } from "../../../middleware/rateLimiter.js";
import { validate } from "../../../middleware/validate.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { analyzeWebAppController, listTestReportsController } from "../controllers/test.controller.js";
import { analyzeWebAppSchema, listReportsQuerySchema } from "../schemas/test.schema.js";

const router = Router();

router.use(
  "/assets",
  express.static(path.resolve(process.cwd(), "storage", "test-reports"), {
    fallthrough: false,
    index: false,
    maxAge: "1h"
  })
);

router.use(authenticate);
router.post("/analyze", testAnalyzeRateLimiter, validate(analyzeWebAppSchema), asyncHandler(analyzeWebAppController));
router.get("/reports", validate(listReportsQuerySchema, "query"), asyncHandler(listTestReportsController));

export default router;

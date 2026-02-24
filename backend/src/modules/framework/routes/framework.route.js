import { Router } from "express";
import { downloadFramework, generateFramework } from "../controllers/framework.controller.js";
import { validate } from "../../../middleware/validate.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { generateFrameworkSchema } from "../schemas/framework.schema.js";

const router = Router();

router.post("/generate", validate(generateFrameworkSchema), asyncHandler(generateFramework));
router.get("/download/:id", asyncHandler(downloadFramework));

export default router;

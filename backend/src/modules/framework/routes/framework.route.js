import { Router } from "express";
import { authenticate } from "../../../middleware/auth.js";
import { validate } from "../../../middleware/validate.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { createFrameworkDownloadAccess, deleteFramework, downloadFramework, generateFramework, listFrameworks } from "../controllers/framework.controller.js";
import { generateFrameworkSchema, listFrameworksQuerySchema } from "../schemas/framework.schema.js";

const router = Router();

router.use(authenticate);
router.get("/", validate(listFrameworksQuerySchema, "query"), asyncHandler(listFrameworks));
router.post("/generate", validate(generateFrameworkSchema), asyncHandler(generateFramework));
router.post("/:id/download-access", asyncHandler(createFrameworkDownloadAccess));
router.get("/download/:id", asyncHandler(downloadFramework));
router.delete("/:id", asyncHandler(deleteFramework));

export default router;

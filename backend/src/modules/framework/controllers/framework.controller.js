import { createHash, randomBytes } from "node:crypto";
import mongoose from "mongoose";
import env from "../../../config/env.js";
import { AppError } from "../../../utils/AppError.js";
import { Framework } from "../models/framework.model.js";
import { generateFrameworkWithAI } from "../services/framework-ai.service.js";
import { cleanupFrameworkBundle, createFrameworkZipBundle } from "../services/framework-file.service.js";

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

const issueDownloadToken = () => {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + env.frameworkDownloadTtlMinutes * 60 * 1000);
  return { token, tokenHash, expiresAt };
};

const buildDownloadPath = (frameworkId) => `/api/framework/download/${frameworkId.toString()}`;

const ensureUserId = (req) => {
  if (!req.auth?.userId) {
    throw new AppError("Unauthorized", 401);
  }

  return req.auth.userId;
};

const ensureValidFrameworkId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid framework id", 400);
  }
};

const ensureDownloadAccess = async (framework) => {
  const download = issueDownloadToken();
  framework.downloadTokenHash = download.tokenHash;
  framework.downloadTokenExpiresAt = download.expiresAt;
  await framework.save();

  return download;
};

const buildFrameworkSummary = (framework, issuedToken = null) => ({
  id: framework._id.toString(),
  language: framework.language,
  automationTool: framework.automationTool,
  pattern: framework.pattern,
  testRunner: framework.testRunner,
  cicd: framework.cicd,
  dockerSupport: framework.dockerSupport,
  filesCount: framework.files?.length || 0,
  folderCount: framework.folderStructure?.length || 0,
  createdAt: framework.createdAt,
  updatedAt: framework.updatedAt,
  download: {
    path: buildDownloadPath(framework._id),
    token: issuedToken,
    expiresAt: framework.downloadTokenExpiresAt?.toISOString() || null
  }
});

export const generateFramework = async (req, res) => {
  const userId = ensureUserId(req);
  const config = req.body;
  const generated = await generateFrameworkWithAI(config);
  const download = issueDownloadToken();

  const framework = await Framework.create({
    userId,
    ...config,
    prompt: generated.prompt,
    folderStructure: generated.folderStructure,
    files: generated.files,
    rawResponse: generated.rawResponse,
    downloadTokenHash: download.tokenHash,
    downloadTokenExpiresAt: download.expiresAt
  });

  res.status(200).json({
    success: true,
    data: {
      id: framework._id,
      folderStructure: framework.folderStructure,
      files: framework.files,
      summary: buildFrameworkSummary(framework, download.token)
    }
  });
};

export const listFrameworks = async (req, res) => {
  const userId = ensureUserId(req);
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const [frameworks, total] = await Promise.all([
    Framework.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Framework.countDocuments({ userId })
  ]);

  const items = frameworks.map((framework) => buildFrameworkSummary(framework));

  res.status(200).json({
    success: true,
    data: {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
      }
    }
  });
};

export const createFrameworkDownloadAccess = async (req, res) => {
  const userId = ensureUserId(req);
  const { id } = req.params;

  ensureValidFrameworkId(id);

  const framework = await Framework.findOne({ _id: id, userId });
  if (!framework) {
    throw new AppError("Framework not found", 404);
  }

  const download = await ensureDownloadAccess(framework);

  res.status(200).json({
    success: true,
    data: {
      path: buildDownloadPath(framework._id),
      token: download.token,
      expiresAt: download.expiresAt.toISOString()
    }
  });
};

export const downloadFramework = async (req, res) => {
  const userId = ensureUserId(req);
  const { id } = req.params;
  const token = typeof req.query.token === "string" ? req.query.token : "";

  ensureValidFrameworkId(id);

  if (!token || token.length < 20) {
    throw new AppError("Download token is required", 401);
  }

  const framework = await Framework.findOne({ _id: id, userId });
  if (!framework) {
    throw new AppError("Framework not found", 404);
  }

  if (!framework.downloadTokenHash || !framework.downloadTokenExpiresAt) {
    throw new AppError("Download link is not available", 410);
  }

  if (framework.downloadTokenExpiresAt < new Date()) {
    throw new AppError("Download link expired", 410);
  }

  const providedHash = hashToken(token);
  if (providedHash !== framework.downloadTokenHash) {
    throw new AppError("Invalid download token", 401);
  }

  const { sandboxDir, zipPath } = await createFrameworkZipBundle(framework._id, framework.files);
  const fileName = `framework-${framework._id.toString()}.zip`;

  let cleaned = false;
  const cleanup = async () => {
    if (cleaned) {
      return;
    }

    cleaned = true;
    await cleanupFrameworkBundle(sandboxDir);
  };

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("X-Content-Type-Options", "nosniff");

  res.download(zipPath, fileName, async (error) => {
    await cleanup();

    if (error && !res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Download failed"
      });
    }
  });

  res.on("close", cleanup);
};

export const deleteFramework = async (req, res) => {
  const userId = ensureUserId(req);
  const { id } = req.params;

  ensureValidFrameworkId(id);

  const framework = await Framework.findOneAndDelete({ _id: id, userId });
  if (!framework) {
    throw new AppError("Framework not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Framework deleted"
  });
};

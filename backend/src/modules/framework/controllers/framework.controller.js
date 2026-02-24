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

const buildDownloadLink = (frameworkId, token) => {
  return `${env.appBaseUrl}/api/framework/download/${frameworkId.toString()}?token=${token}`;
};

export const generateFramework = async (req, res) => {
  const config = req.body;
  const generated = await generateFrameworkWithAI(config);
  const download = issueDownloadToken();

  const framework = await Framework.create({
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
      download: {
        link: buildDownloadLink(framework._id, download.token),
        expiresAt: download.expiresAt.toISOString()
      }
    }
  });
};

export const downloadFramework = async (req, res) => {
  const { id } = req.params;
  const token = typeof req.query.token === "string" ? req.query.token : "";

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid framework id", 400);
  }

  if (!token || token.length < 20) {
    throw new AppError("Download token is required", 401);
  }

  const framework = await Framework.findById(id);
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

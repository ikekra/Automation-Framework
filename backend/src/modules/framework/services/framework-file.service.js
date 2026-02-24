import path from "node:path";
import os from "node:os";
import { promises as fs } from "node:fs";
import { createWriteStream } from "node:fs";
import { randomUUID } from "node:crypto";
import archiver from "archiver";
import { AppError } from "../../../utils/AppError.js";

const TEMP_ROOT = path.join(os.tmpdir(), "autoforge-framework-downloads");

const sanitizeRelativePath = (inputPath) => {
  if (typeof inputPath !== "string" || inputPath.trim().length === 0) {
    throw new AppError("Invalid file path in generated files", 400);
  }

  const trimmed = inputPath.trim().replace(/\\/g, "/");

  if (trimmed.startsWith("/") || /^[a-zA-Z]:/.test(trimmed)) {
    throw new AppError("Absolute paths are not allowed", 400);
  }

  const normalized = path.posix.normalize(trimmed);

  if (normalized === "." || normalized.startsWith("../") || normalized.includes("/../")) {
    throw new AppError("Unsafe file path detected", 400);
  }

  return normalized;
};

const resolveSafePath = (rootDir, relativePath) => {
  const safeRelativePath = sanitizeRelativePath(relativePath);
  const outputPath = path.resolve(rootDir, safeRelativePath);
  const rootResolved = path.resolve(rootDir);

  if (!outputPath.startsWith(`${rootResolved}${path.sep}`) && outputPath !== rootResolved) {
    throw new AppError("Path traversal blocked", 400);
  }

  return outputPath;
};

const writeGeneratedFiles = async (rootDir, files) => {
  for (const file of files) {
    const destination = resolveSafePath(rootDir, file.path);
    const dirName = path.dirname(destination);
    await fs.mkdir(dirName, { recursive: true });
    await fs.writeFile(destination, file.content, "utf8");
  }
};

const zipDirectory = async (sourceDir, zipPath) => {
  await new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
};

export const createFrameworkZipBundle = async (frameworkId, files) => {
  await fs.mkdir(TEMP_ROOT, { recursive: true });
  const sandboxDir = await fs.mkdtemp(path.join(TEMP_ROOT, `${frameworkId.toString()}-`));
  const frameworkRoot = path.join(sandboxDir, "framework");
  const zipPath = path.join(sandboxDir, `${frameworkId.toString()}-${randomUUID()}.zip`);

  await fs.mkdir(frameworkRoot, { recursive: true });
  await writeGeneratedFiles(frameworkRoot, files);
  await zipDirectory(frameworkRoot, zipPath);

  return {
    sandboxDir,
    zipPath
  };
};

export const cleanupFrameworkBundle = async (sandboxDir) => {
  if (!sandboxDir) {
    return;
  }

  await fs.rm(sandboxDir, { recursive: true, force: true });
};

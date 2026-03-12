import PQueue from "p-queue";
import logger from "../../../config/logger.js";
import env from "../../../config/env.js";
import { TestJob } from "../models/test-job.model.js";
import { analyzeWebApp } from "./test-analyzer.service.js";
import { buildAndStoreReport } from "./test-report.service.js";

const queue = new PQueue({ concurrency: Math.max(1, env.testAnalyzeQueueConcurrency) });

const runJob = async (jobId) => {
  const job = await TestJob.findById(jobId);
  if (!job) return;

  job.status = "running";
  job.error = "";
  await job.save();

  try {
    const analyzed = await analyzeWebApp(job.url);
    const report = await buildAndStoreReport({ userId: job.userId, analyzed });
    job.status = "completed";
    job.reportId = report._id;
    await job.save();
  } catch (error) {
    job.status = "failed";
    job.error = error?.message || "Job failed";
    await job.save();
    logger.error("Analyze job failed", { jobId, message: job.error });
  }
};

export const enqueueAnalyzeJob = async ({ userId, url }) => {
  const job = await TestJob.create({ userId, url, status: "queued" });

  queue.add(() => runJob(job._id));

  return job;
};

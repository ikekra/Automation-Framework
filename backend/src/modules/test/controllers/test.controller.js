import { TestReport } from "../models/test-report.model.js";
import { TestJob } from "../models/test-job.model.js";
import { analyzeWebApp } from "../services/test-analyzer.service.js";
import { buildAndStoreReport } from "../services/test-report.service.js";
import { enqueueAnalyzeJob } from "../services/test-queue.service.js";

export const analyzeWebAppController = async (req, res) => {
  const { url } = req.body;
  const analyzed = await analyzeWebApp(url);
  const report = await buildAndStoreReport({ userId: req.auth.userId, analyzed });

  res.status(200).json({
    success: true,
    data: {
      id: report._id,
      url: report.url,
      consoleErrors: report.consoleErrors,
      networkErrors: report.networkErrors,
      jsExceptions: report.jsExceptions,
      performanceMetrics: report.performanceMetrics,
      screenshotUrl: report.screenshotUrl,
      severitySummary: report.severitySummary,
      aiAnalysis: report.aiAnalysis,
      createdAt: report.createdAt
    }
  });
};

export const analyzeWebAppAsyncController = async (req, res) => {
  const { url } = req.body;
  const job = await enqueueAnalyzeJob({ userId: req.auth.userId, url });

  res.status(202).json({
    success: true,
    data: {
      jobId: job._id,
      status: job.status,
      createdAt: job.createdAt
    }
  });
};

export const getTestJobController = async (req, res) => {
  const { jobId } = req.params;
  const job = await TestJob.findOne({ _id: jobId, userId: req.auth.userId }).lean();

  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  res.status(200).json({
    success: true,
    data: job
  });
};

export const listTestReportsController = async (req, res) => {
  const { limit, page, search, severity } = req.query;
  const filters = { userId: req.auth.userId };

  if (search) {
    filters.url = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  }

  if (severity) {
    filters["severitySummary.overallSeverity"] = severity;
  }

  const skip = (page - 1) * limit;
  const [reports, total] = await Promise.all([
    TestReport.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TestReport.countDocuments(filters)
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  res.status(200).json({
    success: true,
    data: {
      items: reports,
      meta: {
        page,
        limit,
        total,
        totalPages
      }
    }
  });
};

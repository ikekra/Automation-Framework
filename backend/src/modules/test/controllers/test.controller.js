import { TestReport } from "../models/test-report.model.js";
import { analyzeWebApp } from "../services/test-analyzer.service.js";
import { computeReportSeveritySummary } from "../services/severity.service.js";
import { analyzeReportWithAI } from "../services/test-ai-analysis.service.js";

export const analyzeWebAppController = async (req, res) => {
  const { url } = req.body;
  const analyzed = await analyzeWebApp(url);
  const severitySummary = computeReportSeveritySummary(analyzed);
  const aiAnalysis = await analyzeReportWithAI({
    ...analyzed,
    severitySummary
  });

  const report = await TestReport.create({
    userId: req.auth.userId,
    url: analyzed.url,
    consoleErrors: analyzed.consoleErrors,
    networkErrors: analyzed.networkErrors,
    jsExceptions: analyzed.jsExceptions,
    performanceMetrics: analyzed.performanceMetrics,
    screenshotUrl: analyzed.screenshotUrl,
    severitySummary,
    aiAnalysis
  });

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

import { TestReport } from "../models/test-report.model.js";
import { computeReportSeveritySummary } from "./severity.service.js";
import { analyzeReportWithAI } from "./test-ai-analysis.service.js";

export const buildAndStoreReport = async ({ userId, analyzed }) => {
  const severitySummary = computeReportSeveritySummary(analyzed);
  const aiAnalysis = await analyzeReportWithAI({
    ...analyzed,
    severitySummary
  });

  const report = await TestReport.create({
    userId,
    url: analyzed.url,
    consoleErrors: analyzed.consoleErrors,
    networkErrors: analyzed.networkErrors,
    jsExceptions: analyzed.jsExceptions,
    performanceMetrics: analyzed.performanceMetrics,
    screenshotUrl: analyzed.screenshotUrl,
    severitySummary,
    aiAnalysis
  });

  return report;
};

import crypto from "node:crypto";
import OpenAI from "openai";
import env from "../../../config/env.js";
import logger from "../../../config/logger.js";
import { AiAnalysisCache } from "../models/ai-analysis-cache.model.js";

const SYSTEM_PROMPT = [
  "You are a senior web reliability engineer.",
  "Analyze test run errors and return ONLY valid JSON.",
  "Schema:",
  "{",
  '  "rootCause": "string",',
  '  "severity": "High|Medium|Low",',
  '  "suggestedFixes": [',
  "    {",
  '      "title": "string",',
  '      "explanation": "string",',
  '      "codeSnippet": "string"',
  "    }",
  "  ],",
  '  "bestPractices": ["string"]',
  "}",
  "Do not include markdown fences."
].join(" ");

const safeJsonParse = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/```json\s*([\s\S]*?)\s*```/i) || content.match(/```\s*([\s\S]*?)\s*```/i);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }
};

const truncateText = (value, maxChars) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars)}…`;
};

const withTimeout = async (promise, timeoutMs) => {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return promise;
  }

  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("AI analysis timed out"));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
};

const normalizeAiAnalysis = (payload) => {
  const severity = ["High", "Medium", "Low"].includes(payload?.severity) ? payload.severity : "Low";
  const rootCause = typeof payload?.rootCause === "string" ? payload.rootCause.trim() : "";
  const bestPractices = Array.isArray(payload?.bestPractices)
    ? payload.bestPractices.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
  const suggestedFixes = Array.isArray(payload?.suggestedFixes)
    ? payload.suggestedFixes
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          title: typeof item.title === "string" ? item.title.trim() : "Suggested Fix",
          explanation: typeof item.explanation === "string" ? item.explanation.trim() : "",
          codeSnippet: typeof item.codeSnippet === "string" ? item.codeSnippet : ""
        }))
        .filter((item) => item.explanation || item.codeSnippet)
    : [];

  return {
    status: "ready",
    rootCause,
    severity,
    suggestedFixes,
    bestPractices,
    rawResponse: JSON.stringify(payload)
  };
};

const buildReportPayload = (report) => {
  const maxItems = Math.max(1, env.aiAnalysisMaxItems);
  const maxChars = Math.max(50, env.aiAnalysisMaxChars);

  const normalizeList = (items, mapFn) =>
    (items || [])
      .slice(0, maxItems)
      .map(mapFn)
      .filter(Boolean);

  return {
    url: report.url,
    severitySummary: report.severitySummary,
    consoleErrors: normalizeList(report.consoleErrors, (item) => ({
      text: truncateText(item?.text, maxChars),
      location: {
        url: truncateText(item?.location?.url, maxChars),
        lineNumber: Number.isInteger(item?.location?.lineNumber) ? item.location.lineNumber : null,
        columnNumber: Number.isInteger(item?.location?.columnNumber) ? item.location.columnNumber : null
      },
      timestamp: item?.timestamp || null
    })),
    networkErrors: normalizeList(report.networkErrors, (item) => ({
      url: truncateText(item?.url, maxChars),
      method: item?.method || "GET",
      status: typeof item?.status === "number" ? item.status : null,
      statusText: truncateText(item?.statusText, maxChars),
      failureText: truncateText(item?.failureText, maxChars),
      resourceType: item?.resourceType || "other",
      timestamp: item?.timestamp || null
    })),
    jsExceptions: normalizeList(report.jsExceptions, (item) => ({
      message: truncateText(item?.message, maxChars),
      stack: truncateText(item?.stack, maxChars),
      timestamp: item?.timestamp || null
    })),
    performanceMetrics: report.performanceMetrics || {}
  };
};

const buildCacheKey = (payload) =>
  crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");

const analysisCache = new Map();

const getCachedAnalysis = (key) => {
  const entry = analysisCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    analysisCache.delete(key);
    return null;
  }

  return entry.value;
};

const setCachedAnalysis = (key, value) => {
  const ttlMs = Math.max(1, env.aiAnalysisCacheTtlMinutes) * 60 * 1000;
  analysisCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
};

const buildPrompt = (report) => {
  const payload = buildReportPayload(report);

  return [
    "Analyze the following web app error report and provide actionable diagnostics.",
    "Prioritize production-safe fixes and include concrete code snippets when relevant.",
    JSON.stringify(payload, null, 2)
  ].join("\n");
};

export const analyzeReportWithAI = async (report) => {
  const signalCount =
    (report?.consoleErrors?.length || 0) + (report?.networkErrors?.length || 0) + (report?.jsExceptions?.length || 0);

  if (env.mockAi || !env.openaiApiKey) {
    return {
      status: "unavailable",
      rootCause: env.mockAi
        ? "AI analysis skipped because MOCK_AI is enabled."
        : "AI analysis skipped because OPENAI_API_KEY is not configured.",
      severity: report?.severitySummary?.overallSeverity || "Low",
      suggestedFixes: [],
      bestPractices: [],
      rawResponse: ""
    };
  }

  if (!signalCount) {
    return {
      status: "unavailable",
      rootCause: "AI analysis skipped because no error signals were captured.",
      severity: report?.severitySummary?.overallSeverity || "Low",
      suggestedFixes: [],
      bestPractices: [],
      rawResponse: ""
    };
  }

  const payload = buildReportPayload(report);
  const cacheKey = buildCacheKey(payload);
  const cached = getCachedAnalysis(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const stored = await AiAnalysisCache.findOne({ hash: cacheKey }).lean();
    if (stored?.aiAnalysis) {
      setCachedAnalysis(cacheKey, stored.aiAnalysis);
      return stored.aiAnalysis;
    }
  } catch (error) {
    logger.warn("AI cache lookup failed", { message: error?.message || "unknown_error" });
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });
  const prompt = buildPrompt(report);

  try {
    const completion = await withTimeout(
      client.chat.completions.create({
      model: env.openaiModel,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]
    }),
      env.aiAnalysisTimeoutMs
    );

    const content = completion.choices?.[0]?.message?.content || "";
    const parsed = safeJsonParse(content);

    if (!parsed) {
      return {
        status: "failed",
        rootCause: "AI analysis response could not be parsed.",
        severity: report?.severitySummary?.overallSeverity || "Low",
        suggestedFixes: [],
        bestPractices: [],
        rawResponse: content
      };
    }

    const normalized = normalizeAiAnalysis(parsed);
    setCachedAnalysis(cacheKey, normalized);
    const expiresAt = new Date(Date.now() + Math.max(1, env.aiAnalysisCacheTtlMinutes) * 60 * 1000);
    AiAnalysisCache.updateOne(
      { hash: cacheKey },
      { $set: { hash: cacheKey, aiAnalysis: normalized, expiresAt } },
      { upsert: true }
    ).catch((error) => {
      logger.warn("AI cache write failed", { message: error?.message || "unknown_error" });
    });
    return normalized;
  } catch (error) {
    logger.warn("OpenAI test analysis failed", {
      message: error?.message || "unknown_error",
      status: error?.status
    });

    return {
      status: "failed",
      rootCause: "AI analysis request failed. You can retry the report analysis later.",
      severity: report?.severitySummary?.overallSeverity || "Low",
      suggestedFixes: [],
      bestPractices: [],
      rawResponse: ""
    };
  }
};

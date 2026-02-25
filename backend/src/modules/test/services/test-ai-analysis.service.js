import OpenAI from "openai";
import env from "../../../config/env.js";
import logger from "../../../config/logger.js";

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

const buildPrompt = (report) => {
  const payload = {
    url: report.url,
    severitySummary: report.severitySummary,
    consoleErrors: (report.consoleErrors || []).slice(0, 20),
    networkErrors: (report.networkErrors || []).slice(0, 20),
    jsExceptions: (report.jsExceptions || []).slice(0, 20),
    performanceMetrics: report.performanceMetrics || {}
  };

  return [
    "Analyze the following web app error report and provide actionable diagnostics.",
    "Prioritize production-safe fixes and include concrete code snippets when relevant.",
    JSON.stringify(payload, null, 2)
  ].join("\n");
};

export const analyzeReportWithAI = async (report) => {
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

  const client = new OpenAI({ apiKey: env.openaiApiKey });
  const prompt = buildPrompt(report);

  try {
    const completion = await client.chat.completions.create({
      model: env.openaiModel,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]
    });

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

    return normalizeAiAnalysis(parsed);
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

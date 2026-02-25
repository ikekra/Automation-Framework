import OpenAI from "openai";
import mongoose from "mongoose";
import env from "../../../config/env.js";
import { signAccessToken, verifyAccessToken } from "../../auth/utils/token.js";
import { buildFrameworkPrompt, generateFrameworkWithAI } from "../../framework/services/framework-ai.service.js";

const ok = (name, details = {}) => ({
  name,
  status: "healthy",
  details
});

const fail = (name, error) => ({
  name,
  status: "unhealthy",
  details: {
    message: error?.message || "Unknown error"
  }
});

const runDatabaseCheck = async () => {
  const result = await mongoose.connection.db.admin().ping();
  return ok("database", { ping: result?.ok === 1 ? "ok" : "unexpected" });
};

const runOpenAiCheck = async () => {
  if (!env.openaiApiKey) {
    return {
      name: "openai",
      status: "degraded",
      details: { message: "OPENAI_API_KEY is not configured" }
    };
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });
  await client.models.retrieve(env.openaiModel);

  return ok("openai", { model: env.openaiModel });
};

const runAuthFlowCheck = async () => {
  const token = signAccessToken({
    userId: "000000000000000000000000",
    role: "admin",
    tokenVersion: 0
  });

  const payload = verifyAccessToken(token);
  return ok("authFlow", {
    tokenType: payload.type,
    role: payload.role
  });
};

const collectRoutes = (router, prefix = "") => {
  const routes = [];
  const stack = router?.stack || [];

  for (const layer of stack) {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods || {}).map((method) => method.toUpperCase());
      for (const method of methods) {
        routes.push(`${method} ${prefix}${layer.route.path}`);
      }
      continue;
    }

    if (layer.name === "router" && layer.handle?.stack) {
      const source = layer.regexp?.source || "";
      const match = source.match(/\\\/api\\\/[a-z0-9\\\/]+/i);
      const nextPrefix = match ? match[0].replace(/\\\//g, "/") : prefix;
      routes.push(...collectRoutes(layer.handle, nextPrefix));
    }
  }

  return routes;
};

const runRouteValidationCheck = async (appInstance) => {
  const discovered = collectRoutes(appInstance?._router);
  const sourceBlob = (appInstance?._router?.stack || [])
    .map((layer) => layer.regexp?.source || "")
    .join(" ");

  const expected = [
    "POST /api/framework/generate",
    "POST /api/test/analyze",
    "GET /api/test/reports",
    "POST /api/v1/auth/login",
    "GET /api/v1/health"
  ];
  const fallbackExpected = [
    "api\\/framework",
    "api\\/test",
    "api\\/v1\\/auth",
    "api\\/v1"
  ];

  const missing = expected.filter((route) => !discovered.some((item) => item.includes(route)));
  const missingFallback = fallbackExpected.filter((fragment) => !sourceBlob.includes(fragment));

  if (missing.length > 0 && missingFallback.length > 0) {
    throw new Error(`Missing routes: ${missing.join(", ")}`);
  }

  return ok("routes", { validated: expected.length });
};

const runFrameworkSimulationCheck = async () => {
  const sampleConfig = {
    language: "TypeScript",
    automationTool: "Playwright",
    pattern: "Page Object Model",
    testRunner: "Playwright Test",
    cicd: "GitHub Actions",
    dockerSupport: true
  };

  const generated = await generateFrameworkWithAI(sampleConfig);
  const prompt = buildFrameworkPrompt(sampleConfig);

  return ok("frameworkSimulation", {
    promptLength: prompt.length,
    folders: generated.folderStructure?.length || 0,
    files: generated.files?.length || 0
  });
};

export const runSelfTestController = async (req, res) => {
  const checks = await Promise.all([
    runDatabaseCheck().catch((error) => fail("database", error)),
    runOpenAiCheck().catch((error) => fail("openai", error)),
    runAuthFlowCheck().catch((error) => fail("authFlow", error)),
    runRouteValidationCheck(req.app).catch((error) => fail("routes", error)),
    runFrameworkSimulationCheck().catch((error) => fail("frameworkSimulation", error))
  ]);

  const hasUnhealthy = checks.some((check) => check.status === "unhealthy");
  const hasDegraded = checks.some((check) => check.status === "degraded");

  res.status(200).json({
    success: true,
    data: {
      overallStatus: hasUnhealthy ? "unhealthy" : hasDegraded ? "degraded" : "healthy",
      timestamp: new Date().toISOString(),
      checks
    }
  });
};

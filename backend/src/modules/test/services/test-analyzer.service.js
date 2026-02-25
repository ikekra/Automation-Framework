import fs from "node:fs/promises";
import path from "node:path";
import env from "../../../config/env.js";
import { AppError } from "../../../utils/AppError.js";
import { assertUrlIsSafe, parseAndValidateTargetUrl } from "./url-security.service.js";

const ensureStorageDir = async () => {
  const storageDir = path.resolve(process.cwd(), "storage", "test-reports");
  await fs.mkdir(storageDir, { recursive: true });
  return storageDir;
};

const collectPerformanceMetrics = async (page) => {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];

    if (!nav) {
      return {
        domContentLoadedMs: null,
        loadEventMs: null,
        responseEndMs: null,
        transferSize: null
      };
    }

    return {
      domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
      loadEventMs: Math.round(nav.loadEventEnd),
      responseEndMs: Math.round(nav.responseEnd),
      transferSize: nav.transferSize || 0,
      encodedBodySize: nav.encodedBodySize || 0,
      decodedBodySize: nav.decodedBodySize || 0
    };
  });
};

const uniqueNetworkErrors = (errors) => {
  const seen = new Set();
  return errors.filter((error) => {
    const key = `${error.method}|${error.url}|${error.status}|${error.failureText}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const analyzeWebApp = async (inputUrl) => {
  const targetUrl = await parseAndValidateTargetUrl(inputUrl);
  const { chromium } = await import("playwright");

  const consoleErrors = [];
  const networkErrors = [];
  const jsExceptions = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: false,
    ignoreHTTPSErrors: false,
    viewport: { width: 1440, height: 900 }
  });

  try {
    const page = await context.newPage();
    const timeoutMs = env.testAnalyzeTimeoutMs;

    page.on("console", (message) => {
      if (message.type() !== "error") {
        return;
      }

      const location = message.location();
      consoleErrors.push({
        text: message.text(),
        location: {
          url: location.url || "",
          lineNumber: Number.isInteger(location.lineNumber) ? location.lineNumber : null,
          columnNumber: Number.isInteger(location.columnNumber) ? location.columnNumber : null
        },
        timestamp: new Date()
      });
    });

    page.on("pageerror", (error) => {
      jsExceptions.push({
        message: error.message,
        stack: error.stack || "",
        timestamp: new Date()
      });
    });

    page.on("requestfailed", (request) => {
      const failure = request.failure();
      networkErrors.push({
        url: request.url(),
        method: request.method(),
        status: null,
        statusText: "",
        failureText: failure?.errorText || "Request failed",
        resourceType: request.resourceType(),
        timestamp: new Date()
      });
    });

    page.on("response", (response) => {
      if (response.status() < 400) {
        return;
      }

      networkErrors.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
        statusText: response.statusText(),
        failureText: "",
        resourceType: response.request().resourceType(),
        timestamp: new Date()
      });
    });

    await page.route("**/*", async (route) => {
      const requestUrl = route.request().url();

      try {
        await assertUrlIsSafe(requestUrl);
        await route.continue();
      } catch {
        networkErrors.push({
          url: requestUrl,
          method: route.request().method(),
          status: null,
          statusText: "",
          failureText: "Blocked by SSRF policy",
          resourceType: route.request().resourceType(),
          timestamp: new Date()
        });
        await route.abort();
      }
    });

    try {
      await page.goto(targetUrl, { timeout: timeoutMs, waitUntil: "networkidle" });
    } catch (error) {
      throw new AppError(`Analysis timeout or navigation failure: ${error.message}`, 408);
    }

    const performanceMetrics = await collectPerformanceMetrics(page);
    const storageDir = await ensureStorageDir();
    const screenshotFileName = `report-${Date.now()}-${Math.random().toString(16).slice(2)}.png`;
    const screenshotPath = path.join(storageDir, screenshotFileName);

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: "png"
    });

    return {
      url: targetUrl,
      consoleErrors,
      networkErrors: uniqueNetworkErrors(networkErrors),
      jsExceptions,
      performanceMetrics,
      screenshotUrl: `${env.appBaseUrl}/api/test/assets/${screenshotFileName}`
    };
  } finally {
    await context.close();
    await browser.close();
  }
};

import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  logLevel: process.env.LOG_LEVEL || "info",
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || "autoforge_refresh",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  mockAi: process.env.MOCK_AI === "true",
  mockEmail: process.env.MOCK_EMAIL !== "false",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpSecure: process.env.SMTP_SECURE === "true",
  aiAnalysisTimeoutMs: Number(process.env.AI_ANALYSIS_TIMEOUT_MS) || 15000,
  aiAnalysisCacheTtlMinutes: Number(process.env.AI_ANALYSIS_CACHE_TTL_MINUTES) || 30,
  aiAnalysisMaxItems: Number(process.env.AI_ANALYSIS_MAX_ITEMS) || 20,
  aiAnalysisMaxChars: Number(process.env.AI_ANALYSIS_MAX_CHARS) || 600,
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:5000",
  frameworkDownloadTtlMinutes: Number(process.env.FRAMEWORK_DOWNLOAD_TTL_MINUTES) || 30,
  testAnalyzeTimeoutMs: Number(process.env.TEST_ANALYZE_TIMEOUT_MS) || 30000,
  testAnalyzeRetries: Number(process.env.TEST_ANALYZE_RETRIES) || 1,
  testAnalyzeRetryDelayMs: Number(process.env.TEST_ANALYZE_RETRY_DELAY_MS) || 750,
  testReportTtlHours: Number(process.env.TEST_REPORT_TTL_HOURS) || 24,
  emailFrom: process.env.EMAIL_FROM || "no-reply@autoforge.local",
  emailVerifyTtlHours: Number(process.env.EMAIL_VERIFY_TTL_HOURS) || 24,
  emailOtpTtlMinutes: Number(process.env.EMAIL_OTP_TTL_MINUTES) || 10,
  testAnalyzeQueueConcurrency: Number(process.env.TEST_ANALYZE_QUEUE_CONCURRENCY) || 1
};

export default Object.freeze(env);

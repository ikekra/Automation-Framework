import mongoose from "mongoose";

const consoleErrorSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    location: {
      url: { type: String, default: "" },
      lineNumber: { type: Number, default: null },
      columnNumber: { type: Number, default: null }
    },
    timestamp: { type: Date, required: true }
  },
  { _id: false }
);

const networkErrorSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    method: { type: String, default: "GET" },
    status: { type: Number, default: null },
    statusText: { type: String, default: "" },
    failureText: { type: String, default: "" },
    resourceType: { type: String, default: "other" },
    timestamp: { type: Date, required: true }
  },
  { _id: false }
);

const jsExceptionSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    stack: { type: String, default: "" },
    timestamp: { type: Date, required: true }
  },
  { _id: false }
);

const aiFixSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Suggested Fix" },
    explanation: { type: String, default: "" },
    codeSnippet: { type: String, default: "" }
  },
  { _id: false }
);

const testReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    url: { type: String, required: true, trim: true },
    consoleErrors: [consoleErrorSchema],
    networkErrors: [networkErrorSchema],
    jsExceptions: [jsExceptionSchema],
    performanceMetrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    screenshotUrl: { type: String, default: "" },
    severitySummary: {
      highCount: { type: Number, default: 0 },
      mediumCount: { type: Number, default: 0 },
      lowCount: { type: Number, default: 0 },
      overallSeverity: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Low",
        index: true
      },
      score: { type: Number, default: 0 }
    },
    aiAnalysis: {
      status: {
        type: String,
        enum: ["ready", "failed", "unavailable"],
        default: "unavailable"
      },
      rootCause: { type: String, default: "" },
      severity: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Low"
      },
      suggestedFixes: [aiFixSchema],
      bestPractices: [{ type: String, default: "" }],
      rawResponse: { type: String, default: "" }
    }
  },
  {
    timestamps: true
  }
);

testReportSchema.index({ userId: 1, createdAt: -1 });
testReportSchema.index({ userId: 1, "severitySummary.overallSeverity": 1, createdAt: -1 });

export const TestReport = mongoose.model("TestReport", testReportSchema);

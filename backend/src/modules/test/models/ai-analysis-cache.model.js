import mongoose from "mongoose";

const aiAnalysisCacheSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true, unique: true, index: true },
    aiAnalysis: { type: mongoose.Schema.Types.Mixed, default: {} },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

aiAnalysisCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AiAnalysisCache = mongoose.model("AiAnalysisCache", aiAnalysisCacheSchema);

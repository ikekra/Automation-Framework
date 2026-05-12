import mongoose from "mongoose";

const generatedFileSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, trim: true },
    content: { type: String, required: true }
  },
  { _id: false }
);

const frameworkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    language: { type: String, required: true, trim: true },
    automationTool: { type: String, required: true, trim: true },
    pattern: { type: String, required: true, trim: true },
    testRunner: { type: String, required: true, trim: true },
    cicd: { type: String, required: true, trim: true },
    dockerSupport: { type: Boolean, required: true },
    prompt: { type: String, required: true },
    folderStructure: [{ type: String, required: true }],
    files: [generatedFileSchema],
    rawResponse: { type: String, default: null },
    downloadTokenHash: { type: String, default: null, index: true },
    downloadTokenExpiresAt: { type: Date, default: null, index: true }
  },
  {
    timestamps: true
  }
);

frameworkSchema.index({ userId: 1, createdAt: -1 });

export const Framework = mongoose.model("Framework", frameworkSchema);

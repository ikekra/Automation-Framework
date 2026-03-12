import mongoose from "mongoose";

const testJobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    url: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued",
      index: true
    },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "TestReport", default: null },
    error: { type: String, default: "" }
  },
  { timestamps: true }
);

testJobSchema.index({ userId: 1, createdAt: -1 });

export const TestJob = mongoose.model("TestJob", testJobSchema);

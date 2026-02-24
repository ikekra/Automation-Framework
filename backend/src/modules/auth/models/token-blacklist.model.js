import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    tokenType: {
      type: String,
      enum: ["access", "refresh"],
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    reason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    emailVerificationTokenHash: {
      type: String,
      default: null,
      index: true
    },
    emailVerificationTokenExpiresAt: {
      type: Date,
      default: null
    },
    emailOtpHash: {
      type: String,
      default: null
    },
    emailOtpExpiresAt: {
      type: Date,
      default: null
    },
    organization: {
      type: String,
      trim: true,
      default: null,
      maxlength: 160
    },
    phone: {
      type: String,
      trim: true,
      default: null,
      maxlength: 40
    },
    plan: {
      type: String,
      enum: ["Starter", "Pro", "Enterprise"],
      default: "Starter",
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      index: true
    },
    tokenVersion: {
      type: Number,
      default: 0
    },
    lastLogin: {
      type: Date,
      default: null
    },
    totpEnabled: {
      type: Boolean,
      default: false
    },
    totpSecret: {
      type: String,
      default: null,
      select: false
    },
    totpTempSecret: {
      type: String,
      default: null,
      select: false
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);

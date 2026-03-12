import nodemailer from "nodemailer";
import env from "../config/env.js";
import logger from "../config/logger.js";
import { AppError } from "./AppError.js";

export const sendEmail = async ({ to, subject, text }) => {
  if (env.mockEmail) {
    logger.info("MOCK_EMAIL enabled. Email sent.", {
      to,
      subject,
      text
    });
    return;
  }

  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    throw new AppError("Email delivery is not configured", 500);
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  try {
    const info = await transporter.sendMail({
      from: env.emailFrom,
      to,
      subject,
      text
    });
    if (env.smtpHost.includes("ethereal.email")) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logger.info("Ethereal preview URL", { previewUrl });
      }
    }
  } catch (error) {
    logger.error("Email delivery failed", {
      message: error?.message || "unknown_error"
    });
    throw new AppError("Email delivery failed", 502);
  }
};

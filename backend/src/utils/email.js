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

  throw new AppError("Email delivery is not configured", 500);
};

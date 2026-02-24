import mongoose from "mongoose";
import logger from "./logger.js";

export const connectToDatabase = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed", { message: error.message });
    throw error;
  }
};

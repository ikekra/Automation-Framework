import mongoose from "mongoose";
import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";
import { connectToDatabase } from "./config/db.js";

let server;

const shutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown.`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }

    await mongoose.connection.close();
    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown", { message: error.message, stack: error.stack });
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectToDatabase(env.mongoUri);

    server = app.listen(env.port, () => {
      logger.info(`API running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error("Server startup failed", { message: error.message, stack: error.stack });
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();

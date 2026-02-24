import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import healthRoute from "./routes/health.route.js";
import authRoute from "./modules/auth/routes/auth.route.js";
import frameworkRoute from "./modules/framework/routes/framework.route.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const allowedOrigins = env.corsOrigin.split(",").map((origin) => origin.trim()).filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (env.nodeEnv !== "production" && /^https?:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS blocked for this origin"));
  },
  credentials: true
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(globalRateLimiter);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api/v1", healthRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/framework", frameworkRoute);

app.use(notFound);
app.use(errorHandler);

export default app;

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import healthRoute from "./routes/health.route.js";
import authRoute from "./modules/auth/routes/auth.route.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(globalRateLimiter);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api/v1", healthRoute);
app.use("/api/v1/auth", authRoute);

app.use(notFound);
app.use(errorHandler);

export default app;

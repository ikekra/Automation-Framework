import express from "express";
import cors from "cors";
import helmet from "helmet";
import healthRoute from "./routes/health.route.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api/v1", healthRoute);

app.use(notFound);
app.use(errorHandler);

export default app;

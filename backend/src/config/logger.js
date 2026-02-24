import winston from "winston";
import env from "./env.js";

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp: time, stack }) => {
    return `${time} ${level}: ${stack || message}`;
  })
);

const logger = winston.createLogger({
  level: env.logLevel,
  defaultMeta: { service: "autoforge-api" },
  transports: [
    new winston.transports.Console({
      format: env.nodeEnv === "production"
        ? combine(timestamp(), errors({ stack: true }), json())
        : consoleFormat
    })
  ]
});

export default logger;

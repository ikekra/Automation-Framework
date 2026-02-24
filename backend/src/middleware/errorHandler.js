import logger from "../config/logger.js";

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  if (statusCode >= 500) {
    logger.error(err.message, { stack: err.stack });
  } else {
    logger.warn(err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {})
  });
};

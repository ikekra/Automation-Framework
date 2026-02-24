import logger from "../config/logger.js";

export const requestLogger = (req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

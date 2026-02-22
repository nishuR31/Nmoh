import logger from "../utils/logger.js";
import { randomUUID } from "crypto";

const requestLogger = (req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader("X-Request-ID", req.requestId);

  const startTime = Date.now();

  logger.http(`→ ${req.method} ${req.originalUrl}`, {
    requestId: req.requestId,
    ip: req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress,
    userAgent: req.headers["user-agent"],
  });

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "http";

    logger[level](`← ${req.method} ${req.originalUrl} ${statusCode} ${duration}ms`, {
      requestId: req.requestId,
      duration,
      statusCode,
    });
  });

  next();
};

export default requestLogger;

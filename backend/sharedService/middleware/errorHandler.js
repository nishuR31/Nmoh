import logger from "../utils/logger.js";
import codes from "../utils/codes.js";

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  let statusCode = err.statusCode || err.code || codes.serverError;
  let message = err.message || "Something went wrong";
  let payload = {};

  if (err.isJoi || err.name === "ValidationError") {
    statusCode = codes.badRequest;
    message = "Validation Error";
    payload = {
      errors: err.details
        ? err.details.map((detail) => ({
            field: detail.path?.join("."),
            message: detail.message,
          }))
        : [{ message: err.message }],
    };
  }

  if (err.code?.startsWith?.("P")) {
    switch (err.code) {
      case "P2002":
        statusCode = codes.conflict;
        message = `Duplicate value for ${err.meta?.target?.join(", ") || "field"}`;
        break;
      case "P2025":
        statusCode = codes.notFound;
        message = "Record not found";
        break;
      case "P2003":
        statusCode = codes.badRequest;
        message = "Foreign key constraint failed";
        break;
      default:
        statusCode = codes.serverError;
        message = "Database error";
    }
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = codes.unauthorized;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = codes.unauthorized;
    message = "Token expired";
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = codes.badRequest;
    message = "File too large";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = codes.badRequest;
    message = "Unexpected file field";
  }

  const isDev = process.env.MODE === "development" || process.env.MODE === "dev";

  const response = {
    success: false,
    statusCode,
    message: isDev ? message : statusCode >= 500 ? "Internal server error" : message,
    ...(Object.keys(payload).length > 0 && { payload }),
    ...(isDev && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = codes.notFound;
  next(error);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;

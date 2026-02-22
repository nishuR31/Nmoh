import error from "../response/error.js";
import codes from "../utils/codes.js";
import { verifyAccess } from "../utils/jwt.js";
import asyncHandler from "../utils/asyncHandler.js";

// === CONFIG ===
const isDev = process.env.MODE === "dev";

const ALLOWED_INTERNAL_IPS = [
  "127.0.0.1",
  "::1",
  "::ffff:127.0.0.1",
  "localhost",
  // '10.0.0.5',   // app-service
  // '10.0.0.6',   // worker
];

const SENSITIVE_HEADERS = [
  "x-user-id",
  "x-authenticated",
  "x-internal-token",
  "x-forwarded-user",
  "x-real-user",
  "x-powered-by",
  "server",
  "x-aspnet",
  "x-forwarded-for",
  "x-env",
  "x-debug",
];

const eventGatewayAuth = asyncHandler((req, res, next) => {
  /* ─── 1. NUKE ANY SPOOFED HEADERS ─── */
  SENSITIVE_HEADERS.forEach((h) => {
    delete req.headers[h];
  });

  /* ─── 2. IP RESTRICTION (skip in dev) ─── */
  if (!isDev) {
    const callerIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    if (!ALLOWED_INTERNAL_IPS.includes(callerIP)) {
      return error(res, "Forbidden: IP not allowed", codes.forbidden, {
        ip: callerIP,
      });
    }
  }

  /* ─── 3. TOKEN EXTRACTION ─── */
  const token = req.headers?.authorization?.split(" ")[1] ?? req?.cookies?.accessToken;

  if (!token) {
    return error(res, "Missing auth token", codes.unauthorized);
  }

  /* ─── 4. VERIFY & INJECT TRUSTED HEADERS ─── */
  try {
    const decoded = verifyAccess(token);

    // Only YOU set these — never client
    req.headers["x-user-id"] = String(decoded.id);
    req.headers["x-authenticated"] = "1";

    /* Optional: attach to req object too */
    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    return error(res, "Unauthorized: Invalid token", codes.unauthorized, {
      error: err.name,
    });
  }
});

export default eventGatewayAuth;

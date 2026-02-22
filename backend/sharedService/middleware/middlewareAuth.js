import asyncHandler from "../utils/asyncHandler.js";
import error from "../response/error.js";
import codes from "../utils/codes.js";
import { verifyAccess } from "../utils/jwt.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  // FIRST: Check if headers were injected by gateway (for service-to-service calls)
  const userId = req.headers["x-user-id"];
  const authenticated = req.headers["x-authenticated"];

  if (userId && authenticated === "1") {
    // Trust gateway-injected headers
    req.user = {
      id: userId,
      authenticated: true,
    };
    return next();
  }

  // SECOND: Check httpOnly cookie (for direct client calls to app service)
  const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return error(res, "Not authenticated", codes.unauthenticated);
  }

  try {
    const decoded = verifyAccess(token);
    req.user = {
      id: decoded.id,
      authenticated: true,
    };
    return next();
  } catch (err) {
    return error(res, "Invalid token", codes.unauthorized);
  }
});

export default authMiddleware;

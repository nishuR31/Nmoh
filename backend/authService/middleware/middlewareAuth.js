import asyncHandler from "../utils/asyncHandler.js";
import error from "../response/error.js";
import codes from "../utils/codes.js";
import { verifyAccess } from "../utils/jwt.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  // FIRST: Check if headers were injected by gateway (for service-to-service calls)
  const userId = req.headers["x-user-id"];
  const authenticated = req.headers["x-authenticated"];

  if (userId && authenticated && authenticated === "1") {
    // Trust gateway-injected headers
    req.user = {
      id: userId,
    };
    return next();
  }
});

export default authMiddleware;

import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
// import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";
import userClient from "../src/prisma.js";
import cookieOptions from "../../sharedService/utils/cookieOptions.js";

const appLogout = asyncHandler(async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  // User must be authenticated
  //  if (!req.user?.id) {
  //  return err(res, "Missing credentials to logout", codes.unauthorized);
  // }

  // Clear access token cookie
  // Clear for current env
  res.clearCookie("accessToken", {
    ...cookieOptions("access"),
    maxAge: 0,
  });

  // Also attempt clear for opposite settings (helps when MODE/env changed)
  res.clearCookie("accessToken", {
    httpOnly: true,
    path: "/",
    secure: false,
    sameSite: "lax",
    maxAge: 0,
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
    maxAge: 0,
  });

  // Clear refresh token in DB
  if (req.user?.id) {
    await userClient.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });
  }

  // Return response
  return success(res, "Logged out successfully", codes.success);
});

export default appLogout;

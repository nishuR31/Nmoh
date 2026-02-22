import err from "../../sharedService/response/error.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import { verifyAccess, accessToken, tokens } from "../../sharedService/utils/jwt.js";
import success from "../../sharedService/response/success.js";
import cookieOptions from "../../sharedService/utils/cookieOptions.js";
import { sendMail } from "../../sharedService/mail/transporter.js";
import appService from "../services/appService.js";
import userClient from "../src/prisma.js";
// ==================== VERIFY PASSLESS TOKEN ====================
/**
 * Verify passless token from email link
 * GET /api/v1/app/auth/passless/:token
 */
let verifyPasslessLink = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return err(res, "Token required", codes.badRequest);
  }

  let response = await appService.verifyPasslessToken(token);

  // Set cookies
  res.cookie("accessToken", response.accessToken, cookieOptions("access"));

  return success(res, "Passless login verified", codes.ok, response);
});

// ==================== SEND PASSLESS LINK ====================
/**
 * Send passwordless login link to email
 * POST /api/v1/app/auth/passless
 */

let sendPasslessLink = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return err(res, "Email required", codes.badRequest);
  }

  let user = await userClient.user.findUnique({ where: { email } });
  if (!user) {
    return err(res, "No user found", codes.notFound);
  }
  let response = await appService.sendPasslessLink(user);

  return success(res, "Passless link sent to email", codes.ok, response);
});

export { verifyPasslessLink, sendPasslessLink };

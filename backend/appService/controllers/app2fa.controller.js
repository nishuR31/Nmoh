import appService from "../services/appService.js";
import { render } from "../../sharedService/utils/qr.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js"
import success from "../../sharedService/response/success.js";
import codes from "../../sharedService/utils/codes.js";
import err from "../../sharedService/response/error.js";
export const verify2FA = asyncHandler(async (req, res) => {
  if (!req.user.id) {
    return err(res, "No user found, kindly login.", codes.notFound);
  }

  let { token } = req.body;
  if (!token) {
    return err(res, "Token not found", codes.notFound);
  }

  let response = await appService.verify2fa(token, req.user.id);
  return success(res, "Verified and enabled 2FA", codes.ok, response);
});

export const setup2FA = asyncHandler(async (req, res) => {
  if (!req.user.id) {
    return err(res, "No user found, kindly login", codes.notFound);
  }

  let response = await appService.setup2fa(req.user.id);
  return success(
    res,
    "Successfully setup, kindly verify token from your totp",
    codes.ok,
    response,
    { qr: render(response.qr) },
  );
});

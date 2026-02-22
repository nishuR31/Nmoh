import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";

let appForgot = asyncHandler(async (req, res, next) => {
  let { email } = req.body;
  if (!email) {
    return err(res, "Email not found", codes.notFound);
  }
  let response = await appService.forgot(email);
  return success(res, "Successfully sent mail", codes.ok, response);
});

export default appForgot;

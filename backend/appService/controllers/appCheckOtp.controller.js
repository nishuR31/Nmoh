import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";

let appCheckOtp = asyncHandler(async (req, res, next) => {
  let { otp, email } = req.body;
  if (!otp || !email) {
    return err(res, `${!otp ? "OTP" : "Email"} not found`, codes.notFound);
  }
  let response = await appService.checkOtp(email, otp);
  return success(res, "Checking Otp", codes.ok, response);
});

export default appCheckOtp;

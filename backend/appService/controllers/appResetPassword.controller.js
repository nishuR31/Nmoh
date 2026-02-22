import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import err from "../../sharedService/response/error.js";
import appService from "../services/appService.js";

let resetPassword = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return err(res, `${!email ? "Email" : "Password"} not found`, codes.notFound);
  }
  let response = await appService.resetPassword(email, password);
  return success(res, "Successfully reset password", codes.ok, response);
});

export default resetPassword;

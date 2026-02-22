import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";

let appMail = asyncHandler(async (req, res, next) => {
  let { to, name, type, data } = req.body;
  if (!to || !name || !data) {
    return err(res, "All fields are required", codes.badRequest);
  }
  let payload = { to, name, type, data };
  let result = await appService.mail(payload);
  return success(res, "Mail successfully sent", codes.ok, result);
});

export default appMail;

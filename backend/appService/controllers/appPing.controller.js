import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";

let appPing = asyncHandler(async (req, res, next) => {
  let response = await appService.ping();
  return success(res, "App successfully pinged", codes.ok, response);
});

export default appPing;

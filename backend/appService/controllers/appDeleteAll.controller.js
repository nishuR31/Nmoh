import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";

const appDeleteAll = asyncHandler(async (req, res) => {
  const result = await appService.deleteAll();
  return success(res, "Users deleted", codes.ok, result);
});

export default appDeleteAll;

import success from "../../sharedService/response/success.js";
import err from "../../sharedService/response/error.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";

let appMe = asyncHandler(async (req, res, next) => {
  let { id } = req.user;
  if (!id) {
    return err(res, "User id not found", codes.notFound);
  }
  let response = await appService.me(id);
  if (!response) {
    return err(res, "User not found", codes.notFound, response);
  }
  return success(res, `Hello ${response?.name ?? response.username ?? "User"}`, codes.ok, response);
});

export default appMe;

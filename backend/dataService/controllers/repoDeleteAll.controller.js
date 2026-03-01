import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import repoService from "../services/repoService.js";

let repoDeleteAll = asyncHandler(async (req, res, next) => {
  let response = await repoService.deleteAll();
  return success(res, "All repos deleted", codes.ok, response);
});

export default repoDeleteAll;

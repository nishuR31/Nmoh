import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import repoService from "../services/repoService.js";

let repoPing = asyncHandler(async (req, res, next) => {
  let response = await repoService.ping();
  return success(res, "Repo service alive", codes.ok, response);
});

export default repoPing;

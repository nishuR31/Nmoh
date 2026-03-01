import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import repoService from "../services/repoService.js";

let repoFetch = asyncHandler(async (req, res, next) => {
  let { filters } = req.query;
  let response = await repoService.fetch(filters);
  return success(res, "Repos successfully fetched", codes.ok, response);
});

export default repoFetch;

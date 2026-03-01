import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import repoService from "../services/repoService.js";

let repoFetchOne = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  let response = await repoService.fetchOne({ id });
  return success(res, "Repo successfully fetched", codes.ok, response);
});

export default repoFetchOne;

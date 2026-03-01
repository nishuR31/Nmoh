import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import repoService from "../services/repoService.js";

let repoAdd = asyncHandler(async (req, res, next) => {
  let data = req.body;
  let response = await repoService.add(data);
  return success(res, "Repo successfully added", codes.created, response);
});

export default repoAdd;

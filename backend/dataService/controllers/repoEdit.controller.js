import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import repoService from "../services/repoService.js";

let repoEdit = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  let updates = req.body;
  let response = await repoService.edit({ id, ...updates });
  return success(res, "Repo successfully updated", codes.ok, response);
});

export default repoEdit;

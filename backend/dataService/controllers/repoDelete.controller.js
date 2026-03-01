import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import repoService from "../services/repoService.js";

let repoDelete = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  let response = await repoService.delete({ id });
  return success(res, "Repo successfully deleted", codes.ok, response);
});

export default repoDelete;

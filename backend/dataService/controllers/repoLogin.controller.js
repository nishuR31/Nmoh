import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import repoService from "../services/repoService.js";

let repoLogin = asyncHandler(async (req, res, next) => {
  // Example: expects { userId } in body, returns repos for that user
  let { userId } = req.body;
  let response = await repoService.fetch({ userIds: { has: userId } });
  return success(res, "Repos for user fetched", codes.ok, response);
});

export default repoLogin;

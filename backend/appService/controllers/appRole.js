import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";

const appRole = asyncHandler(async (req, res) => {
  const { identifier, role } = req.body;
  try {
    const result = await appService.changeRole({ identifier, role });
    return success(res, "Role updated successfully", codes.success,result);
  } catch (error) {
    return err(res, error.message || "Role update failed", codes.badRequest);
  }
});

export default appRole;

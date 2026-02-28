import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";

const approveAdminRegistration = asyncHandler(async (req, res) => {
  const { adminEmail, superadminOtp, role } = req.body;
  try {
    const result = await appService.approveAdminRegistration({ adminEmail, superadminOtp, role });
    return success(res, { message: "Admin registration approved", data: result }, codes.success);
  } catch (error) {
    return err(res, error.message || "Approval failed", codes.badRequest);
  }
});

export default approveAdminRegistration;

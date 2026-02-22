import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";

let appVerifyRegister = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(codes.badRequest).json({
      message: "Email, OTP, and password are required",
    });
  }

  const result = await appService.verifyRegister({ email, otp, password });
  return success(res, "Registration successful", codes.created, result);
});

export default appVerifyRegister;

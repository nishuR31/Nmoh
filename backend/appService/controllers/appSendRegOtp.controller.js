import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";

let appSendRegOtp = asyncHandler(async (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(codes.badRequest).json({
      message: "Email and username are required",
    });
  }

  const result = await appService.register({ email, username });
  return success(res, result, codes.ok);
});

export default appSendRegOtp;

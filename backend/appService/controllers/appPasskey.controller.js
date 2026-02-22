import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";

// Setup Passkey (device password)
export const setupPasskey = asyncHandler(async (req, res, next) => {
  const { email, devicePassword } = req.body;
  if (!email || !devicePassword) {
    return err(res, "Email and device password required", codes.badRequest);
  }
  const result = await appService.setupPasskey({ email, devicePassword });
  return success(res, "Successfully setup passkey", codes.ok, result);
});

// Login with Passkey (device password)
export const loginWithPasskey = asyncHandler(async (req, res, next) => {
  const { email, devicePassword } = req.body;
  if (!email || !devicePassword) {
    return err(res, "Email and device password required", codes.badRequest);
  }
  const user = await appService.loginWithPasskey({ email, devicePassword });
  // You may want to issue tokens/cookies here as in normal login
  let { accessToken, refreshToken } = tokens({
    id: user.id,
    email: user.email,
  });
  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "None",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.cookie("accessToken", accessToken, cookieOptions("access"));
  await userClient.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return success(
    res,
    `Successfully login,Welcome back ${payload?.email ?? payload?.username ?? "User"}`,
    codes.ok,
    {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken,
    },
  );
});

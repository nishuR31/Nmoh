import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";

// Login with TOTP (2FA code only)
const appTotpLogin = asyncHandler(async (req, res, next) => {
  const { email, totp } = req.body;
  if (!email || !totp) {
    return err(res, "Email and TOTP code required", codes.badRequest);
  }
  const user = await appService.loginWithTotp({ email, totp });
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

export default appTotpLogin;

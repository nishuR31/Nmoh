import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import err from "../../sharedService/response/error.js";
import { tokens } from "../../sharedService/utils/jwt.js";
import  appLoginSchema from "../validators/appLogin.schema.js";
import cookieOptions from "../../sharedService/utils/cookieOptions.js";
import userClient from "../config/prisma.js";

let appLogin = asyncHandler(async (req, res, next) => {
  if (req.user?.id) {
    return err(res, "Logout before loggin back.", codes.unauthorized);
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");

  let payload;
  try {
    payload = appLoginSchema.parse(req.body);
  } catch (e) {
    return next(err(res, "Validation error", codes.badRequest, e.errors || e));
  }
  let user = await appService.login(payload);
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

export default appLogin;

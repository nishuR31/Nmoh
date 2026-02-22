import appService from "../services/appService.js";

const disable2FA = asyncHandler(async (req, res) => {
  if (!req.user.id) {
    return err(res, "No user found, kindly login.", codes.notFound);
  }
  await appService.disable2fa(req.user.id);
  return success(res, "2FA disabled", codes.ok);
});

export default disable2FA;

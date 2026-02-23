import success from "../../sharedService/response/success.js";
import err from "../../sharedService/response/error.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import { imgbbUploader } from "../../sharedService/upload/upload.js";
import  appPasswordSchema  from "../validators/appPassword.schema.js";
import  appEditSchema  from "../validators/appEdit.schema.js";
import userClient from "../config/prisma.js";
import bcrypt from "bcrypt";

let appEdit = asyncHandler(async (req, res, next) => {
  let payload;
  try {
    payload = appEditSchema.parse(req.body);
  } catch (e) {
    return err(res, "Validation error", codes.badRequest, e.errors || e);
  }

  const { currentPassword, newPassword, confirmPassword } = req.body || {};
  const wantsPasswordChange =
    Boolean(currentPassword) || Boolean(newPassword) || Boolean(confirmPassword);

  if (wantsPasswordChange) {
    let passwordPayload;
    try {
      passwordPayload = appPasswordSchema.parse({ currentPassword, newPassword, confirmPassword });
    } catch (e) {
      return err(res, "Password validation error", codes.badRequest, e.errors || e);
    }

    const user = await userClient.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return err(res, "User not found", codes.notFound);
    }

    const isMatch = await bcrypt.compare(passwordPayload.currentPassword, user.password);
    if (!isMatch) {
      return err(res, "Current password is incorrect", codes.unauthorized);
    }

    if (passwordPayload.newPassword !== passwordPayload.confirmPassword) {
      return err(res, "Passwords dont match.");
    }

    const hashedPassword = await bcrypt.hash(passwordPayload.newPassword, 10);
    payload.password = hashedPassword;
  }
  if (payload.url === "") {
    payload.url = null;
  }
  if (payload.url && typeof payload.url !== "string") {
    payload.url = String(payload.url);
  }
  if (req.file) {
    const imageUrl = await imgbbUploader(req.file.buffer, "website-images");
    payload.url = imageUrl?.url || payload.url;
  }
  let user = await appService.edit(req.user.id, payload);
  return success(res, "User data successfully updated", codes.success, user);
});

export default appEdit;

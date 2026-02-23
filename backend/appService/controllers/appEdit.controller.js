import success from "../../sharedService/response/success.js";
import err from "../../sharedService/response/error.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import { imgbbUploader } from "../../sharedService/upload/upload.js";
import appPasswordSchema from "../validators/appPassword.schema.js";
import userClient from "../config/prisma.js";
import bcrypt from "bcrypt";
import Joi from "joi";

// basic schema allowing arbitrary fields, adjust as needed
const appEditSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  name: Joi.string().allow("", null).optional(),
  url: Joi.string().uri().allow("", null).optional(),
}).unknown(true);

let appEdit = asyncHandler(async (req, res, next) => {
  let payload = await appEditSchema.validateAsync(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  const { currentPassword, newPassword, confirmPassword } = req.body || {};
  const wantsPasswordChange =
    Boolean(currentPassword) || Boolean(newPassword) || Boolean(confirmPassword);

  if (wantsPasswordChange) {
    const passwordPayload = await appPasswordSchema.validateAsync(
      { currentPassword, newPassword, confirmPassword },
      { abortEarly: false, stripUnknown: true, context: { isReset: false } },
    );

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

import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import menuService from "../services/menuService.js";
import menuAddSchema from "../validators/menuAdd.schema.js";
import { imgbbUploader } from "../../sharedService/upload/upload.js";

let menuAddController = asyncHandler(async (req, res, next) => {
  let payload = await menuAddSchema.validateAsync(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (req.file) {
    const imageUrl = await imgbbUploader(req.file.buffer, "menu-images");
    payload.url = imageUrl.url;
    payload.deleteUrl = imageUrl.deleteUrl;
  }
  const created = await menuService.add(payload);
  // Never leak tokens, only return created object
  return success(res, "Menu item successfully added", codes.ok, { menu: created });
});

export default menuAddController;

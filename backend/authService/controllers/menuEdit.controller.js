import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import menuService from "../services/menuService.js";
import menuEditSchema from "../validators/menuEdit.schema.js";
import { imgbbUploader } from "../../sharedService/upload/upload.js";

let menuEditController = asyncHandler(async (req, res, next) => {
  let payload = await menuEditSchema.validateAsync(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  payload.id = req.params.id;
  if (req.file) {
    const imageUrl = await imgbbUploader(req.file.buffer, "menu-images");
    payload.url = imageUrl.url;
    payload.deleteUrl = imageUrl.deleteUrl;
  }
  let response = await menuService.edit(payload);
  return success(res, "Menu item successfully edited", codes.ok, response);
});

export default menuEditController;

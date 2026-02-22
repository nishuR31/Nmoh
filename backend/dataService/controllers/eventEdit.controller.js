import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import eventService from "../services/eventService.js";
import eventEditSchema from "../validators/eventEdit.schema.js";
import { imgbbUploader } from "../../sharedService/upload/upload.js";

let eventEditController = asyncHandler(async (req, res, next) => {
  let payload = await eventEditSchema.validateAsync(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  payload.id = req.params.id;
  if (req.file) {
    const imageUrl = await imgbbUploader(req.file.buffer, "event-images");
    payload.url = imageUrl.url;
    payload.deleteUrl = imageUrl.deleteUrl;
  }
  let response = await eventService.edit(payload);
  return success(res, "Event successfully edited", codes.ok, response);
});

export default eventEditController;

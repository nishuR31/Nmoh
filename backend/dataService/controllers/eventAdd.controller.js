import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import eventService from "../services/eventService.js";
import eventAddSchema from "../validators/eventAdd.schema.js";
import { imgbbUploader } from "../../sharedService/upload/upload.js";
let eventAddController = asyncHandler(async (req, res, next) => {
  let payload = await eventAddSchema.validateAsync(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (req.file) {
    const imageUrl = await imgbbUploader(req.file.buffer, "event-images");
    payload.url = imageUrl.url;
    payload.deleteUrl = imageUrl.deleteUrl;
  }
  const created = await eventService.add(payload);
  // Never leak tokens, only return created object
  return success(res, "Event successfully added", codes.ok, { event: created });
});

export default eventAddController;

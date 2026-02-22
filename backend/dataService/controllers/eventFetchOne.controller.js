import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import eventService from "../services/eventService.js";
import eventFindSchema from "../validators/eventFind.schema.js";

let eventFindController = asyncHandler(async (req, res, next) => {
  let payload = await eventFindSchema.validateAsync(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });
  let response = await eventService.fetchOne(payload);
  return success(res, "Event successfully fetched", codes.ok, response);
});

export default eventFindController;

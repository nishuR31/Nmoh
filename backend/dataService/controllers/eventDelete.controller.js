import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import eventService from "../services/eventService.js";
import eventFindSchema from "../validators/eventFind.schema.js";
let eventDeleteController = asyncHandler(async (req, res, next) => {
  let payload = await eventFindSchema.validateAsync(
    { id: req.params.id },
    {
      abortEarly: false,
      stripUnknown: true,
    },
  );
  let response = await eventService.delete(payload);
  return success(res, "Event successfully deleted", codes.ok, response);
});

export default eventDeleteController;

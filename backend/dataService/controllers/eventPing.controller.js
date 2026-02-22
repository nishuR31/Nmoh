import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import eventService from "../services/eventService.js";

let eventPing = asyncHandler(async (req, res, next) => {
  let response = await eventService.ping();
  return success(res, "Event successfully pinged", codes.ok, response);
});

export default eventPing;

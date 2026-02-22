import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import eventService from "../services/eventService.js";

let eventFetch = asyncHandler(async (req, res, next) => {
  let { filters } = req.query;
  let response = await eventService.fetch(filters);
  return success(res, "Events successfully fetched", codes.ok, response);
});

export default eventFetch;

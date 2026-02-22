import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import eventService from "../services/eventService.js";

const eventDeleteAll = asyncHandler(async (req, res) => {
  const result = await eventService.deleteAll();
  return success(res, "Events deleted", codes.ok, result);
});

export default eventDeleteAll;

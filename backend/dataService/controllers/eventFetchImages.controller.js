import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import eventService from "../services/eventService.js";

let eventFetchImages = asyncHandler(async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return success(res, "No event IDs provided", codes.ok, []);
    }

    let response = await eventService.fetchImages(ids);
    return success(res, "Event images successfully fetched", codes.ok, response);
  } catch (error) {
    console.error("Event Images Fetch Error:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
});

export default eventFetchImages;

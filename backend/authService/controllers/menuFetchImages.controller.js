import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import menuService from "../services/menuService.js";

let menuFetchImages = asyncHandler(async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return success(res, "No menu IDs provided", codes.ok, []);
    }

    let response = await menuService.fetchImages(ids);
    return success(res, "Menu images successfully fetched", codes.ok, response);
  } catch (error) {
    console.error("Menu Images Fetch Error:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
});

export default menuFetchImages;

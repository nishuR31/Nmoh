import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import menuService from "../services/menuService.js";

let menuFetch = asyncHandler(async (req, res, next) => {
  try {
    let response = await menuService.fetch();
    return success(res, "Menu items successfully fetched", codes.ok, response);
  } catch (error) {
    console.error("Menu Fetch Error:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
});

export default menuFetch;

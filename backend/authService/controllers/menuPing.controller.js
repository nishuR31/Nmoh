import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import menuService from "../services/menuService.js";

let menuPing = asyncHandler(async (req, res, next) => {
  let response = await menuService.ping();
  return success(res, "Menu successfully pinged", codes.ok, response);
});

export default menuPing;

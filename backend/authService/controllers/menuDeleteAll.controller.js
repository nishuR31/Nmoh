import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import menuService from "../services/menuService.js";

const menuDeleteAll = asyncHandler(async (req, res) => {
  const result = await menuService.deleteAll();
  return success(res, "Menu items deleted", codes.ok, result);
});

export default menuDeleteAll;

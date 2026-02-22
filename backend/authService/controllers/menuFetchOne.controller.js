import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import menuService from "../services/menuService.js";
import menuFindSchema from "../validators/menuFind.schema.js";

let menuFindController = asyncHandler(async (req, res, next) => {
  let payload = await menuFindSchema.validateAsync(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });
  let response = await menuService.fetchOne(payload);
  return success(res, "Menu item successfully fetched", codes.ok, response);
});

export default menuFindController;

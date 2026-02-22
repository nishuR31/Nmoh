import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appRegisterSchema from "../validators/appRegister.schema.js";
import appService from "../services/appService.js";

let appRegister = asyncHandler(async (req, res, next) => {
  let payload = await appRegisterSchema.validateAsync(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  let response = await appService.register(payload);
  return success(res, "Successfully registered", codes.ok, response);
});

export default appRegister;

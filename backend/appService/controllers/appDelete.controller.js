import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import appFindSchema from "../validators/appFind.schema.js";

const appDelete = asyncHandler(async (req, res) => {
  // Allow deleting self or arbitrary id (admin usage). Ensure auth middleware handles permissions.
  const payload = await appFindSchema.validateAsync(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  const result = await appService.delete(payload.id);

  return success(res, "User deleted", codes.ok, { id: payload.id, result });
});

export default appDelete;

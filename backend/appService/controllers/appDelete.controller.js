import success from "../../sharedService/response/success.js";
import asyncHandler from "../../sharedService/utils/asyncHandler.js";
import codes from "../../sharedService/utils/codes.js";
import appService from "../services/appService.js";
import appFindSchema  from "../validators/appFind.schema.js";
import err from "../../sharedService/response/error.js";
const appDelete = asyncHandler(async (req, res) => {
  // Allow deleting self or arbitrary id (admin usage). Ensure auth middleware handles permissions.
  let payload;
  try {
    payload = appFindSchema.parse(req.params);
  } catch (e) {
    return next(err(res, "Validation error", codes.badRequest, e.errors || e));
  }

  const result = await appService.delete(payload.id);

  return success(res, "User deleted", codes.ok, { id: payload.id, result });
});

export default appDelete;

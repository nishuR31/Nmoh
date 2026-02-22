import Joi from "joi";

const eventFindSchema = Joi.object({
  id: Joi.string().trim().required().messages({
    "string.empty": "ID is required",
    "any.required": "ID is required to find the resource.",
  }),
});

export default eventFindSchema;

import Joi from "joi";

const appFindSchema = Joi.object({
  id: Joi.string().trim().length(24).hex().required().messages({
    "string.length": "Invalid ID format.",
    "string.hex": "ID must be a valid Mongo ObjectId.",
    "any.required": "ID is required to find the user.",
  }),
});

export default appFindSchema;

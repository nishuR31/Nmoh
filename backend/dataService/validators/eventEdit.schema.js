import Joi from "joi";

const eventEditSchema = Joi.object({
  // id: Joi.string().trim().length(24).hex().required().messages({
  //   "string.length": "Invalid ID format.",
  //   "string.hex": "ID must be a valid Mongo ObjectId.",
  //   "any.required": "ID is required to edit event",
  // }),

  name: Joi.string().trim().min(3).max(100).optional(),

  description: Joi.string().trim().allow("").max(1000).optional(),

  url: Joi.string().trim().allow("", null).optional(),
  deleteUrl: Joi.string().trim().allow("", null).optional(),

  visible: Joi.boolean().optional(),

  eventDate: Joi.string().trim().allow("", null).optional(),

  performer: Joi.string().trim().max(100).optional().allow("", null),

  eventTime: Joi.string().trim().optional().allow("", null),
});

export default eventEditSchema;

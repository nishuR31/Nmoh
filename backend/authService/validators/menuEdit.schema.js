import Joi from "joi";

const menuItemSchema = Joi.object({
  id: Joi.string().trim().uuid().optional().messages({
    "string.guid": "Invalid ID format. ID must be a valid UUID.",
  }),

  name: Joi.string().trim().min(2).max(100).optional(),
  slug: Joi.string().trim().optional(),
  description: Joi.string().allow("", null).optional(),
  price: Joi.number().positive().optional(),
  discount: Joi.number().min(0).max(100).optional(),
  url: Joi.string().allow("", null).optional(),
  deleteUrl: Joi.string().allow("", null).optional(),
  likes: Joi.number().integer().min(0).optional(),
  visible: Joi.boolean().optional(),

  availability: Joi.string()
    .valid("AVAILABLE", "UNAVAILABLE", "OUT_OF_STOCK", "SEASONAL")
    .optional(),
});

export default menuItemSchema;

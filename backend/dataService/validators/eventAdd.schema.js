import Joi from "joi";

const eventAddSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),

  description: Joi.string().trim().allow("").max(1000),

  url: Joi.string().trim().allow("", null).optional(),
  deleteUrl: Joi.string().trim().allow("", null).optional(),
  likes: Joi.number().integer().min(0).default(0),

  visible: Joi.boolean().default(true),

  eventDate: Joi.string().trim().optional().allow("", null),

  performer: Joi.string().trim().max(100).optional().allow("", null),

  eventTime: Joi.string().trim().optional().allow("", null),
});

export default eventAddSchema;

import Joi from "joi";

const menuAddSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),

  description: Joi.string().trim().allow("").max(1000),
  price: Joi.number().required(),
  discount: Joi.number().optional().allow(0),
  url: Joi.string().uri().optional().allow(null, ""),
  deleteUrl: Joi.string().uri().optional().allow(null, ""),

  likes: Joi.number().integer().min(0).default(0),

  visible: Joi.boolean().default(true),

  availability: Joi.string().required(),
});

export default menuAddSchema;

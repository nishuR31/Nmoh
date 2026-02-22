import Joi from "joi";

const appRegisterSchema = Joi.object({
  username: Joi.string().trim().min(3).max(100).lowercase().required().messages({
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must not exceed 100 characters",
    "any.required": "Username is required",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().trim().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),

  name: Joi.string().trim().min(2).max(100).optional(),

  contact: Joi.string().trim().optional().allow("", null),

  url: Joi.string().uri().optional().allow("", null),
});

export default appRegisterSchema;

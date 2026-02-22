import Joi from "joi";

const appLoginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),

  rememberMe: Joi.boolean().optional().default(false),
});

export default appLoginSchema;

import Joi from "joi";

const appAddSchema = Joi.object({
  username: Joi.string().trim().min(3).max(100).lowercase().required(),

  name: Joi.string().trim().min(3).max(100).optional(),

  password: Joi.string().trim().required(),

  email: Joi.string().trim().email().required(),

  contact: Joi.string().trim().optional().allow("", null),

  verified: Joi.boolean().optional(),

  url: Joi.string().uri().optional().allow("", null),

  otp: Joi.string().optional().allow(null),
  otpExpiresAt: Joi.date().optional().allow(null),

  verifiedOtp: Joi.boolean().optional().default(false),

  blocked: Joi.boolean().optional().default(false),

  loginAttempt: Joi.number().integer().default(0).optional(),

  refreshToken: Joi.string().optional().default(null),
});

export default appAddSchema;

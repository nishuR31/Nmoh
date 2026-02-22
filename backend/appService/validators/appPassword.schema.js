import Joi from "joi";

const appPasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .trim()
    .when("$isReset", {
      is: false,
      then: Joi.required(),
    })
    .messages({
      "string.empty": "Current password is required",
      "any.required": "Current password is required",
    }),

  newPassword: Joi.string()
    .trim()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.empty": "New password is required",
      "any.required": "New password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 128 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, and special character",
    }),

  confirmPassword: Joi.string().trim().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your password",
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),

  newPassword: Joi.string()
    .trim()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.empty": "New password is required",
      "any.required": "New password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 128 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, and special character",
    }),

  confirmPassword: Joi.string().trim().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your password",
  }),
});

export default appPasswordSchema;

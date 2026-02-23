import { z } from "zod";

const appAddSchema = z.object({
  username: z.string().min(3).max(100).toLowerCase().trim().nonempty(),
  name: z.string().min(3).max(100).optional(),
  password: z.string().trim().nonempty(),
  email: z.string().email().trim().nonempty(),
  contact: z.string().optional().nullable(),
  verified: z.boolean().optional(),
  url: z.string().url().optional().nullable(),
  otp: z.string().optional().nullable(),
  otpExpiresAt: z.coerce.date().optional().nullable(),
  verifiedOtp: z.boolean().optional().default(false),
  blocked: z.boolean().optional().default(false),
  loginAttempt: z.number().int().optional().default(0),
  refreshToken: z.string().optional().nullable(),
});

export default appAddSchema;

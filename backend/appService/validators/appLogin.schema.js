import { z } from "zod";

 const appLoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email" })
    .trim()
    .nonempty({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .nonempty({ message: "Password is required" }),
  rememberMe: z.boolean().optional().default(false),
});

export default appLoginSchema

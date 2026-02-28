import { z } from "zod";

const appRegisterSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(100, { message: "Username must not exceed 100 characters" })
    .toLowerCase()
    .trim()
    .nonempty({ message: "Username is required" }),
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .trim()
    .nonempty({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .trim()
    .nonempty({ message: "Password is required" }),
  name: z.string().min(2).max(100).optional(),
  contact: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
});

export default appRegisterSchema;

import { z } from "zod";

 const appEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .trim()
    .nonempty({ message: "Email is required" }),
});

export default appEmailSchema

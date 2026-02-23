import { z } from "zod";

 const appEditSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  contact: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
});

export default appEditSchema

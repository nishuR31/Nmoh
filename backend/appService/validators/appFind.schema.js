import { z } from "zod";

 const appFindSchema = z.object({
  id: z
    .string()
    .length(24, { message: "Invalid ID format." })
    .regex(/^[a-fA-F0-9]{24}$/, { message: "ID must be a valid Mongo ObjectId." })
    .nonempty({ message: "ID is required to find the user." }),
});
export default appFindSchema

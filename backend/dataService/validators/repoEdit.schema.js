import { z } from "zod";

const repoEditSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  backendLinks: z.array(z.string()).optional(),
  emails: z.array(z.string()).optional(),
  githubLinks: z.array(z.string()).optional(),
  hostedLinks: z.array(z.string()).optional(),
  servicesUsed: z.array(z.string()).optional(),
  userIds: z.array(z.string()).optional(),
});

export default repoEditSchema;

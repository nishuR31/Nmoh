import { z } from "zod";

const repoAddSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  backendLinks: z.array(z.string()).optional(),
  emails: z.array(z.string()).optional(),
  githubLinks: z.array(z.string()).optional(),
  hostedLinks: z.array(z.string()).optional(),
  servicesUsed: z.array(z.string()).optional(),
  userIds: z.array(z.string()).optional(),
});

export default repoAddSchema;

import { z } from "zod";

import { workflowStatusSchema } from "./status.js";

export const workflowSchema = z.object({
  id: z.string().min(1),
  status: workflowStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Workflow = z.infer<typeof workflowSchema>;

import { z } from "zod";

export const workflowStatusSchema = z.enum([
  "pending",
  "in_progress",
  "awaiting_input",
  "completed",
  "failed",
  "canceled"
]);

export type WorkflowStatus = z.infer<typeof workflowStatusSchema>;

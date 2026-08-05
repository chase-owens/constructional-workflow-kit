import { workflowStatusSchema } from "@chase-ai-workflow/domain";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

import { jsonResponse } from "../shared/response.js";

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const status = workflowStatusSchema.parse("completed");

  return jsonResponse(200, {
    status: "ok",
    workflowStatus: status
  });
};

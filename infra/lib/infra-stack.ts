import type { StackProps } from "aws-cdk-lib";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import type { Construct } from "constructs";
import path from "path";
import { fileURLToPath } from "url";

import { project } from "../../project.config.js";
import { createNodejsFunction } from "./constructs/node-lambda.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export class WorkflowStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const healthFunction = createNodejsFunction(this, "HealthFunction", {
      entry: path.join(currentDirectory, "../../lambdas/src/health/index.ts"),
      handler: "handler"
    });

    const api = new HttpApi(this, "WorkflowApi", {
      apiName: project.apiname
    });

    api.addRoutes({
      path: "/health",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration("HealthIntegration", healthFunction)
    });

    new CfnOutput(this, "ApiUrl", { value: api.apiEndpoint });
  }
}

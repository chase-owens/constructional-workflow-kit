import { Duration } from "aws-cdk-lib";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, type NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";

export type CreateNodeLambdaProps = Omit<NodejsFunctionProps, "runtime" | "architecture">;

export const createNodejsFunction = (scope: Construct, id: string, props: CreateNodeLambdaProps) =>
  new NodejsFunction(scope, id, {
    runtime: Runtime.NODEJS_22_X,
    architecture: Architecture.ARM_64,
    memorySize: 256,
    timeout: Duration.seconds(30),
    bundling: {
      minify: true,
      sourceMap: true
    },
    ...props
  });

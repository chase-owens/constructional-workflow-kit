import * as cdk from "aws-cdk-lib";

import { project } from "../../project.config.js";
import { WorkflowStack } from "../lib/infra-stack.js";

const app = new cdk.App();

new WorkflowStack(app, project.stackName);

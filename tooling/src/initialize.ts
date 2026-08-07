import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { confirm, input } from "@inquirer/prompts";

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

const STARTER_SCOPE = "@constructional-workflow";

const WORKSPACES = ["client", "domain", "infra", "lambdas", "tooling"] as const;

interface ProjectIdentity {
  projectName: string;
  displayName: string;
  packageScope: string;
  stackName: string;
  apiName: string;
}

const REPOSITORY_ROOT = path.resolve(import.meta.dirname, "../..");
const PROJECT_CONFIG_PATH = path.join(REPOSITORY_ROOT, "project.config.ts");

const PROJECT_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const validateProjectName = (value: string): true | string => {
  const projectName = value.trim();

  if (!projectName) {
    return "A project name is required.";
  }

  if (!PROJECT_NAME_PATTERN.test(projectName)) {
    return "Use lowercase kebab-case, for example: landman-workflow.";
  }

  return true;
};

const rewriteDependencyScope = (
  dependencies: Record<string, string> | undefined,
  packageScope: string
): Record<string, string> | undefined => {
  if (!dependencies) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(dependencies).map(([name, version]) => [
      name.startsWith(`${STARTER_SCOPE}/`) ? name.replace(STARTER_SCOPE, packageScope) : name,
      version
    ])
  );
};

const toWords = (value: string): string[] => value.trim().split("-").filter(Boolean);

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const toDisplayName = (value: string): string => toWords(value).map(capitalize).join(" ");

const toPascalCase = (value: string): string => toWords(value).map(capitalize).join("");

const createSuggestions = (projectName: string): ProjectIdentity => ({
  projectName,
  displayName: toDisplayName(projectName),
  packageScope: `@${projectName}`,
  stackName: `${toPascalCase(projectName)}Stack`,
  apiName: `${projectName}-api`
});

const renderProjectConfig = (identity: ProjectIdentity): string => `export const project = {
  projectName: "${identity.projectName}",
  displayName: "${identity.displayName}",
  packageScope: "${identity.packageScope}",
  stackName: "${identity.stackName}",
  apiName: "${identity.apiName}"
} as const;
`;

const printSuggestions = (identity: ProjectIdentity): void => {
  console.log("\nConstruction Plan\n");

  console.log("Project");
  console.log(`  Name:                 ${identity.projectName}\n`);

  console.log("Identity");
  console.log(`  Display name:         ${identity.displayName}`);
  console.log(`  Package scope:        ${identity.packageScope}\n`);

  console.log("Infrastructure");
  console.log(`  CloudFormation stack: ${identity.stackName}`);
  console.log(`  API name:             ${identity.apiName}\n`);
};

const updateWorkspacePackageJsons = async (identity: ProjectIdentity): Promise<void> => {
  for (const workspace of WORKSPACES) {
    const packageJsonPath = path.join(REPOSITORY_ROOT, workspace, "package.json");

    const contents = await readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(contents) as PackageJson;

    const updatedPackageJson: PackageJson = {
      ...packageJson,

      name: `${identity.packageScope}/${workspace}`,

      dependencies: rewriteDependencyScope(packageJson.dependencies, identity.packageScope),

      devDependencies: rewriteDependencyScope(packageJson.devDependencies, identity.packageScope),

      peerDependencies: rewriteDependencyScope(packageJson.peerDependencies, identity.packageScope),

      optionalDependencies: rewriteDependencyScope(
        packageJson.optionalDependencies,
        identity.packageScope
      )
    };

    await writeFile(packageJsonPath, `${JSON.stringify(updatedPackageJson, null, 2)}\n`, "utf8");
  }
};

export const initialize = async (): Promise<void> => {
  console.log("\nConstructional Workflow Kit");
  console.log("Let's construct your next workflow application.\n");

  console.log("Project names must use lowercase kebab-case.");
  console.log("Examples:");
  console.log("  landman-workflow");
  console.log("  diligence-review");
  console.log("  restaurant-vision\n");

  const projectName = await input({
    message: "Project name:",
    validate: validateProjectName,
    transformer: (value) => value.trim()
  });

  const suggestions = createSuggestions(projectName.trim());

  printSuggestions(suggestions);

  const accepted = await confirm({
    message: "Apply this project identity to the repository?",
    default: true
  });

  if (!accepted) {
    console.log("\nNo files were changed.");
    return;
  }

  const existingConfig = await readFile(PROJECT_CONFIG_PATH, "utf8");

  if (!existingConfig.includes("export const project")) {
    throw new Error(
      `Refusing to overwrite ${PROJECT_CONFIG_PATH}: expected project configuration was not found.`
    );
  }

  await writeFile(PROJECT_CONFIG_PATH, renderProjectConfig(suggestions), "utf8");
  await updateWorkspacePackageJsons(suggestions);

  console.log("\n✓ Updated project.config.ts");
  console.log("✓ Updated workspace package identities");
  console.log(`✓ Package scope set to ${suggestions.packageScope}`);
  console.log(`✓ Stack name set to ${suggestions.stackName}`);

  console.log("\nNext steps");
  console.log("  1. Review project.config.ts");
  console.log("  2. Run the validation pipeline: `npm run validate`");
  console.log("  3. Begin construction\n");
};

await initialize();

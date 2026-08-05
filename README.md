# Constructional Workflow Kit

## A Constructional Approach to Engineering Workflow Applications

A reusable TypeScript monorepo foundation for constructing AI-powered workflow applications.

This repository is intentionally small. It provides a proven starting structure for applications that commonly need:

- a shared domain package
- Node.js Lambda services
- AWS CDK infrastructure
- a web client
- consistent repository tooling
- an incremental validation process

It does not attempt to anticipate every future application. Product-specific schemas, infrastructure, integrations, and abstractions should be added only when the process being implemented requires them.

## Purpose

The purpose of this starter is to remove repeated setup work without predetermining the product.

It establishes the repository boundaries, tooling, and validation process that have proved useful across multiple workflow applications while leaving the business process free to determine what should be built next.

The starter is designed to answer:

> What foundation do we repeatedly need before meaningful product construction can begin?

It is not designed to answer:

> What architecture, infrastructure, or user experience will every future application require?

Those decisions belong to the application.

## What is a Workflow Application?

A workflow application assists a user in progressing from one meaningful state to another through an intentional sequence of interactions.

Unlike general-purpose software, workflow applications are organized around accomplishing an outcome rather than exposing functionality.

Examples include:

- interviews
- assessments
- document review
- due diligence
- onboarding
- guided analysis
- operational procedures
- decision support

The process determines the interaction.

The interaction determines the interface.

The interface determines the technology.

## Philosophy

This repository is guided by three engineering principles.

### 1. The technology of process informs the technology of tools.

Technology selection begins with the process that must produce the intended outcome.

Before selecting frameworks, cloud services, databases, orchestration systems, or AI models, define:

- what the user is trying to accomplish
- what information is required
- what sequence produces a reliable result
- what can occur independently
- where evidence must be combined
- where human judgment is required
- what constitutes completion

Only then should the implementation technology be selected.

---

### 2. Start with nothing. Add only what has earned its place.

Every workspace, dependency, helper, and abstraction should solve a demonstrated problem.

The starter deliberately avoids speculative infrastructure, premature abstractions, and framework conveniences that have not yet justified their existence through repeated use.

---

### 3. Responsibility determines organization.

Software should be organized around responsibilities rather than technologies.

Before deciding where code belongs, determine who owns the responsibility.

Ownership determines organization.

Organization determines maintainability.

When responsibilities are clear, architectural boundaries become obvious.
When responsibilities are unclear, architecture becomes accidental.

The objective is not simply to separate files.

The objective is to preserve clear ownership as the system grows.

## Selecting Technology

The default tools in this repository are starting decisions, not universal prescriptions.

When beginning a new application, ask:

1. What interaction is the user participating in?
2. Is the experience primarily sequential, page-oriented, or request/response driven?
3. Is the interface a cohesive product experience or a collection of independent modules?
4. Where does state primarily live?
5. Does the application need progressive enhancement or server-controlled mutations?
6. Is there an organizational ecosystem, component library, or team standard that should outweigh greenfield preferences?

The answers should determine the client technology.

### Choose SvelteKit when

SvelteKit is a strong fit when the application is primarily:

- a guided workflow
- an interview
- document intake and review
- a sequence of forms or decisions
- a focused customer-facing product
- a route-oriented operational process

Its file-based routing maps naturally to process stages, and its component model keeps focused applications direct and relatively low-ceremony.

SvelteKit is the default client in this starter because many of the applications it is intended to support are cohesive, workflow-driven products.

### Choose React when

React is a strong fit when the application is primarily:

- an enterprise application shell
- a collection of reusable modules
- an admin or operations portal
- a large design system
- an embedded application or widget
- a product developed across multiple independent teams

Its ecosystem and component architecture are especially valuable when the interface is assembled from independently maintained features or must integrate with an established React organization.

### Choose Remix when

Remix is a strong fit when the application is fundamentally organized around web requests, server-owned data, forms, mutations, and progressive enhancement.

It is especially compelling when:

- the server is the primary source of truth
- route loaders and actions closely mirror the business process
- forms should work with the platform rather than around it
- navigation and data mutations are central to the application model

Many workflow applications can fit this model well.

### Do not choose by framework identity alone

Do not select a client framework only because it is:

- familiar
- popular
- newer
- perceived as more scalable
- preferred in the abstract

Select the tool whose model best supports the process, the users, and the maintenance environment.

## Construction Methodology

This repository is built using a systematic and methodical approach to software construction.

Rather than attempting to design an entire application before writing code, each capability is introduced as a small, independently verifiable increment. Every new dependency, abstraction, helper, or workspace must justify its existence by solving a demonstrated problem.

This approach provides several benefits:

- Problems are isolated to the most recent change.
- Every commit leaves the repository in a deployable state.
- Design decisions can be evaluated while their context is still fresh.
- Infrastructure, tooling, and architecture evolve from repeated need rather than anticipation.
- Complexity grows only when the process being implemented requires it.

The objective is not simply to produce working software, but to construct software whose evolution remains understandable.

Every increment follows the same validation pipeline before construction continues:

```text
Create
    ↓
Format
    ↓
Lint (0 warnings)
    ↓
Type Check
    ↓
Build
    ↓
Synth (Infrastructure)
    ↓
Continue
```

## Repository Architecture

The repository is organized around architectural responsibilities rather than implementation details.

```text
.
├── client/            # User interface
├── domain/            # Shared business language
├── infra/             # AWS infrastructure
├── lambdas/           # Server-side workflow execution
├── tooling/           # Repository construction tooling
│
├── project.config.ts  # Project identity
├── package.json
├── tsconfig.base.json
├── eslint.config.js
└── prettier.config.js
```

Each workspace has a single responsibility.

### Root

The root defines the repository.

It owns:

- repository tooling
- shared TypeScript configuration
- formatting
- linting
- workspace management
- project identity

The root should not contain application logic.

---

### Tooling

The tooling workspace owns repository construction.

Responsibilities include:

- project initialization
- repository tooling
- developer workflows
- future validation and diagnostics

The tooling workspace should improve the engineering experience without introducing application behavior.

---

### Domain

The domain package defines the language shared across the application.

Examples include:

- schemas
- contracts
- shared types
- domain primitives
- validation

The domain package should remain independent of AWS, SvelteKit, Lambda, or infrastructure concerns.

If multiple workspaces need the same business concept, it belongs here.

---

### Lambdas

The Lambda workspace implements server-side workflow behavior.

Responsibilities include:

- API handlers
- workflow orchestration
- AI integrations
- persistence
- external service communication

Lambda code depends on the domain package but should not define domain concepts itself.

---

### Infrastructure

Infrastructure provisions the execution environment.

Responsibilities include:

- Lambda deployment
- API Gateway
- EventBridge
- DynamoDB
- S3
- CloudFront
- Cognito

Infrastructure should construct resources rather than implement business logic.

---

### Client

The client implements the user experience.

Its responsibility is to present workflows clearly and collect information required by the process.

It should consume domain models rather than redefine them.

## Dependency Direction

One architectural rule governs every workspace in this repository:

> Dependencies flow inward toward the domain.

```text
                Domain
             ↗    ↑    ↖
            /     │     \
      Client   Lambdas   MCP
            \     │
             \    │
         Infrastructure
```

The domain defines the business language.

Everything else consumes that language.

The domain should not know about:

- AWS
- Lambda
- API Gateway
- CDK
- SvelteKit
- React
- Remix
- databases
- infrastructure

The domain represents the business, not the technology.

When a new concept is required, ask:

> Is this a business concept or an implementation detail?

If it is a business concept that multiple workspaces understand, it belongs in the domain package.

If it exists only because of the chosen technology, it belongs in the consuming workspace.

This direction allows infrastructure, user interfaces, and execution environments to evolve independently while preserving a single business language across the application.

## Architectural Boundaries

Each workspace owns a single responsibility.

When introducing new code, determine who owns the responsibility before deciding where the implementation belongs.

Ownership is more important than location.

A file can always be moved.

Poorly defined responsibilities are much harder to untangle.

## Project Configuration

The repository centralizes project identity in a single configuration file.

This includes values such as:

- project name
- display name
- package scope
- CloudFormation stack name
- API name

Project identity is established by the repository initializer.

Run:

```bash
npm run initialize
```

## Creating a New Workflow

1. Create a repository from this template.
2. Run `npm run initialize`.
3. Review `project.config.ts`.
4. Run the validation pipeline: `npm run validate`.
5. Begin construction.

Run:

Format
↓
Format Check
↓
Lint
↓
Type Check
↓
Build
↓
Synth

Only begin product construction after the repository is green.

## Development/Validation Commands

The repository follows a common validation pipeline. Run these commands from the repository root.

### Initialize

Construct a new workflow project identity.

```bash
npm run initialize
```

### Daily Development

```bash
npm install
npm run dev --workspace=@constructional-workflow/client
```

### Validation Pipeline

Run the complete repository validation pipeline.

```bash
npm run validate
```

Equivalent to:

```bash
npm run format
npm run format:check
npm run lint
npm run check
npm run build
npm run synth
```

Every increment should successfully complete this pipeline before construction continues.

### Individual Workspaces

Validate a single workspace when working within it.

```bash
npm run lint --workspace=@constructional-workflow/domain
npm run check --workspace=@constructional-workflow/domain
npm run build --workspace=@constructional-workflow/domain
```

Replace `domain` with:

- `client`
- `lambdas`
- `infra`

as appropriate.

### Infrastructure

Generate the CloudFormation template without deploying resources.

```bash
npm run synth --workspace=@constructional-workflow/infra
```

Deployment intentionally remains a project decision rather than part of the starter.

## Engineering Workflow

Every change follows the same cycle.

```text
Think
    ↓
Construct
    ↓
Validate
    ↓
Reflect
    ↓
Continue
```

The objective is not to produce the largest amount of code.

The objective is to produce the next verified increment.

Large systems are constructed by repeatedly producing small, validated improvements whose responsibilities are clearly understood.

## Future Directions

The repository intentionally evolves through small, verified increments.
Future capabilities will be introduced only after they have earned
their place through repeated use.

### Project Initialization

- [x] Derive project identity from a single project name.
- [x] Generate project configuration suggestions.
- [x] Populate `project.config.ts`.
- [ ] Update workspace package names.
- [ ] Update project references throughout the repository.
- [ ] Rename the Git repository automatically.
- [ ] Install dependencies.
- [ ] Create projects directly from the template.
- [x] Validate project configuration.
- [ ] Doctor command for repository diagnostics.
- [ ] Guide technology selection through constructional questions.

Future directions are intentionally documented rather than immediately implemented.

Capabilities are introduced only after repeated use demonstrates that they have earned their place.

### Engineering Workflow

Future tooling will continue to reinforce the construction methodology
described throughout this repository rather than simply automate tasks.

## Closing Thoughts

Good software rarely emerges from selecting the perfect technology.

It emerges from understanding the process, defining clear responsibilities, introducing complexity only when it is justified, and validating every increment before continuing.

The objective of this starter is not simply to accelerate development.

Its objective is to encourage a disciplined way of constructing software that remains understandable as it grows.

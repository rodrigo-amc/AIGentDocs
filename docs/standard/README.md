# Documentation Standard for AI-Augmented Software Engineering

This repository contains a **docs-as-code framework** designed so that AI agents can understand, document, and develop software projects efficiently. It can be adopted in new projects as well as existing ones.

---

## Table of Contents

<!-- [REQUIRED] Complete index with relative paths to every file under /docs. Must be kept up to date. -->

### Standard (`standard/`)

- [README.md](./README.md) — This file (entry point)
- [AGENT.md](./AGENT.md) — Global operating instructions for AI agents
- [AGENT_REVIEW.md](./AGENT_REVIEW.md) — Documentation audit prompt
- [QUICKSTART.md](./QUICKSTART.md) — Framework usage guide
- [changelog.yaml](./changelog.yaml) — Version history of the standard

#### Structure and Format Guides

- [guide_product.md](./guide_product.md) — Instructions for the product files
- [guide_domain_modules.md](./guide_domain_modules.md) — Instructions for domain modules
- [guide_architecture.md](./guide_architecture.md) — Instructions for the Design Docs
- [guide_engineering.md](./guide_engineering.md) — Instructions for engineering standards
- [guide_adrs.md](./guide_adrs.md) — Instructions for Architecture Decision Records

#### Agent Instructions (by context)

- [agent_product.md](./agent_product.md) — Operating rules: product (DDD, Onboarding)
- [agent_architecture.md](./agent_architecture.md) — Operating rules: architecture
- [agent_engineering.md](./agent_engineering.md) — Operating rules: engineering
- [agent_adrs.md](./agent_adrs.md) — Operating rules: ADRs

#### Reference Templates (`standard/templates/`)

- [vision.md](./templates/vision.md)
- [roadmap.md](./templates/roadmap.md)
- [quality_attributes.md](./templates/quality_attributes.md)
- [domain_module.md](./templates/domain_module.md)
- [system_overview.md](./templates/system_overview.md)
- [data_flow.md](./templates/data_flow.md)
- [infrastructure.md](./templates/infrastructure.md)
- [tech_stack.yaml](./templates/tech_stack.yaml)
- [testing_strategy.md](./templates/testing_strategy.md)
- [api_guidelines.md](./templates/api_guidelines.md)

### Project Documents (`project/`)

- `project/01_product/` — vision.md, roadmap.md, quality_attributes.md, domain_modules/
- `project/02_architecture/` — system_overview.md, data_flow.md, infrastructure.md
- `project/03_engineering/` — tech_stack.yaml, testing_strategy.md, api_guidelines.md
- `project/04_adrs/` — [NNNN]-[title].md

---

## Philosophy of the Standard

This standard is **designed with AI agents as its primary audience**. The directory structure, the modularization of documents, and the reading protocols are optimized so that an agent can understand the context of a software project efficiently, minimizing context window and token usage.

All documents must remain **human-readable** — humans are the ones who create, review, and approve the content. However, the design decisions of the standard (what to document, where to place it, how to structure it, and how to navigate it) prioritize interaction with AI agents.

> **Note on language:** The documentation language is up to each project's development team.

---

## Directory Structure

```text
/docs
├── standard/                              # The framework (instructions, rules, templates)
│   ├── README.md                          # This file (entry point)
│   ├── AGENT.md                           # Global operating instructions and session management
│   ├── AGENT_REVIEW.md                    # Documentation audit prompt (on demand)
│   ├── QUICKSTART.md                      # Framework usage guide
│   ├── changelog.yaml                     # Version history of the standard
│   │
│   ├── guide_product.md                   # Structure and format of 01_product
│   ├── guide_domain_modules.md            # Structure and format of domain_modules
│   ├── guide_architecture.md              # Structure and format of 02_architecture
│   ├── guide_engineering.md               # Structure and format of 03_engineering
│   ├── guide_adrs.md                      # Structure and format of 04_adrs
│   │
│   ├── agent_product.md                   # Operating rules: product (DDD, Onboarding)
│   ├── agent_architecture.md              # Operating rules: architecture
│   ├── agent_engineering.md               # Operating rules: engineering
│   ├── agent_adrs.md                      # Operating rules: ADRs
│   │
│   └── templates/                         # Reference templates for agents
│       ├── vision.md
│       ├── roadmap.md
│       ├── quality_attributes.md
│       ├── domain_module.md
│       ├── system_overview.md
│       ├── data_flow.md
│       ├── infrastructure.md
│       ├── tech_stack.yaml
│       ├── testing_strategy.md
│       └── api_guidelines.md
│
└── project/                               # Project documents (empty by default)
    ├── 01_product/
    │   ├── vision.md                      # Product vision, elevator pitch, scope, and Domain Entity Map (DDD)
    │   ├── roadmap.md                     # Current project status, milestones, and what's ahead
    │   ├── quality_attributes.md          # Non-functional requirements
    │   └── domain_modules/                # Requirements modularized by domain entity
    │       └── [module_name].md
    ├── 02_architecture/
    │   ├── system_overview.md             # C4 diagrams, folder structure, and patterns
    │   ├── data_flow.md                   # Data flows and data model
    │   └── infrastructure.md              # Topology, deployment, and CI/CD
    ├── 03_engineering/
    │   ├── tech_stack.yaml                # Exact technology stack (YAML)
    │   ├── testing_strategy.md            # Testing strategy and coverage
    │   └── api_guidelines.md              # [CONDITIONAL] Only if endpoints are exposed
    └── 04_adrs/
        └── [NNNN]-[title].md              # Individual decision records
```

---

## Sections this file must contain in a project

| Section | Type | Description |
|---|---|---|
| Project Name | **[REQUIRED]** | Official name and a 1-2 line description of the project. |
| Table of Contents | **[REQUIRED]** | Complete index with relative paths to every file under `/docs`. Must be kept up to date whenever the structure changes. |
| Reading Protocol | **[REQUIRED]** | Recommended sequential reading order to understand the project (see guide below). |
| Maintenance Protocol | **[REQUIRED]** | Rules for editing, creating, or deleting documentation files (see guide below). |
| Conventions | **[REQUIRED]** | Chosen language, date format, writing style. |
| Version History | **[REQUIRED]** | Structured record of changes to the standard in `changelog.yaml`. |

> **Note:** When adopting the framework in a project, the header of this file must be replaced with the actual project's name and description.

---

## Adoption Guide

### New Project (Greenfield)

If the project has no code yet, fill out the documentation **before implementing**:

1. Copy `templates/vision.md` to `project/01_product/vision.md` → Define what will be built.
2. Create the necessary `domain_modules/` from `templates/domain_module.md`.
3. Copy `templates/roadmap.md` to `project/01_product/roadmap.md` → Prioritize the tasks.
4. Copy the architecture templates to `project/02_architecture/` → Design system_overview, data_flow, infrastructure.
5. Copy `templates/tech_stack.yaml` to `project/03_engineering/` → Choose technologies (with ADRs).
6. Copy `templates/testing_strategy.md` to `project/03_engineering/` → Testing strategy.
7. Implement the code following the documentation.

### Existing Project (Brownfield)

If the project already has code, document it through **reverse engineering**. The order is different — you start from the concrete (code) and move toward the abstract (product):

1. **`project/03_engineering/tech_stack.yaml`** → Analyze the code and record the actual technologies.
2. **`project/02_architecture/system_overview.md`** → Diagram the architecture that already exists.
3. **`project/02_architecture/infrastructure.md`** → Document where and how it runs.
4. **`project/01_product/vision.md`** → Describe what the product does and who it's for.
5. **`project/01_product/domain_modules/`** → Identify entities in the code and create modules with User Stories documented as already implemented (`state: done`).
6. **`project/01_product/roadmap.md`** → Use the board to plan what's **missing**: new features, refactors, bugs.
7. **`project/04_adrs/`** → Create retroactive ADRs (`status: accepted`) for the technical decisions already made.

> **Tip:** An AI agent can dramatically speed up the brownfield path. It can analyze the source code and generate documentation drafts for human review. See `AGENT.md` for Onboarding Mode.

---

## Reading Protocol

Order in which a new agent should consume the documentation to get contextually oriented at the lowest token cost:

1. **`standard/AGENT.md`** → Understand the global operating rules.
2. **`project/01_product/roadmap.md`** → Identify the current milestone/sprint and pick up the active task (`[In Progress]`).
3. **`project/01_product/domain_modules/[affected_module].md`** → Read **ONLY** the module (or modules) directly referenced by the chosen active task.
4. **`project/02_architecture/system_overview.md`** → Understand where that module fits within the overall system.
5. **`project/03_engineering/tech_stack.yaml`** → Know the technical boundaries before generating or modifying code.
6. *(Optional)* **`project/04_adrs/`** and **`project/01_product/vision.md`** → Consult the decision history or product vision only when blocked or facing directional questions during development.

---

## Maintenance Protocol

1. **Do not create files outside the defined structure.** Every new file must be placed in the corresponding `project/` directory according to its nature (product, architecture, engineering, or ADR).
2. **Do not modify the directory structure** without recording an ADR that justifies the change.
3. **New domain modules** must be created from the `standard/templates/domain_module.md` template, following the structure defined in `standard/guide_domain_modules.md`, completing all required sections.
4. **Every accepted ADR** that modifies a technical standard **must** be reflected by updating the corresponding file in `project/03_engineering/`.
5. **When adding or removing files**, update the Table of Contents in this file.
6. **Sections marked [REQUIRED]** may not be removed or left empty.
7. **Every new document** must include the YAML frontmatter corresponding to its type (see next section).

---

## Frontmatter Conventions

Every markdown document in the standard must start with a **YAML frontmatter** block. Frontmatter lets AI agents obtain key metadata about a document without parsing its full content.

### Common fields (all documents)

| Field | Type | Description |
|---|---|---|
| `type` | **[REQUIRED]** | Document type identifier. |
| `version` | **[REQUIRED]** | Document version (e.g., `1.0`). |
| `last_updated` | **[REQUIRED]** | Date of last update in `YYYY-MM-DD` format. |

### The `state` field (working documents)

Applies to: `domain_modules`, documents in `project/02_architecture/`, and documents in `project/03_engineering/`. It does **not** apply to `vision.md`, `roadmap.md`, or ADRs (which have their own `status`).

| Value | Meaning | Implication for the agent |
|---|---|---|
| `pending` | Defined but not implemented | Free to work on this document/implementation |
| `doing` | Someone is working on this | **Hands off** without prior coordination |
| `done` | Completed and operational | **Do not modify** without justification (an ADR or explicit instruction) |
| `deprecated` | No longer current | Ignore for new implementations |

> **Important:** These are the **only allowed values** for the `state` field. Do not use alternative values.

### Type-specific schemas

Each `guide_*.md` file in `standard/` defines the complete frontmatter schema for the project files it covers, including the specific fields that apply to that document type.

---

## Principles of the Standard

1. **Modularity (Modular PRD)**: Functional requirements are not a centralized list; they live inside their corresponding domain module (`domain_modules/`). Each module is a mini-PRD.
2. **Self-description**: Each area of the standard has a `guide_*.md` explaining what files it contains and how to create and maintain them, plus an `agent_*.md` with operating rules for agents.
3. **Outcome-Oriented Writing**: Rigid "The system shall..." lists are avoided. **User Stories** capture business value and **Acceptance Criteria (AC)** drive validation.
4. **Design Docs**: The `project/02_architecture/` folder acts as the Design Doc repository, describing the technical solution to the requirements defined at the product level.
5. **Minimum Sufficient Context**: The documentation is structured so an AI agent can read only what it needs for a specific task without flooding its context.
6. **Traceability**: Architectural decisions (ADRs) are reflected in engineering (`project/03_engineering/`) whenever they modify technical standards.
7. **Docs as Code**: Documentation files live alongside the source code, are versioned with Git, and are maintained as part of the development workflow.

---

## Conventions

<!-- [REQUIRED] Chosen language, date format, writing style. -->

| Convention | Value |
|---|---|
| Documentation language | *To be defined by each project's team* |
| Date format | `YYYY-MM-DD` |
| Writing style | Clear, outcome-oriented, readable by humans and AI agents |

---

## Version History

<!-- [REQUIRED] Structured record of changes to the standard. -->

See [changelog.yaml](./changelog.yaml) for the full version history.

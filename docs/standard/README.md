# Documentation Standard for AI-Augmented Software Engineering

A **docs-as-code standard**: it treats a project's documentation as code — versioned, reviewed, and validated like source — so it becomes a living source of truth that AI agents use across the whole lifecycle. Agent profiles cover both **design** (product via DDD, architecture, engineering, decisions) and **implementation** (scaffolding, building, reviewing, and testing code from those docs). Adoptable in new and existing projects.

This document is the standard's **specification** — its structure, protocols, and conventions.

---

## Table of Contents

<!-- [REQUIRED] Complete index with relative paths to every file under /docs. Must be kept up to date. -->

### Standard (`standard/`)

- [README.md](./README.md) — This file (entry point)
- [AGENT.md](./AGENT.md) — Global operating instructions for AI agents
- [AGENT_REVIEW.md](./AGENT_REVIEW.md) — Documentation audit prompt
- [changelog.yaml](./changelog.yaml) — Version history of the standard

#### Structure and Format Guides

- [guide_product.md](./guide_product.md) — Instructions for the product files
- [guide_domain_modules.md](./guide_domain_modules.md) — Instructions for domain modules
- [guide_architecture.md](./guide_architecture.md) — Instructions for the Design Docs
- [guide_engineering.md](./guide_engineering.md) — Instructions for engineering standards
- [guide_adrs.md](./guide_adrs.md) — Instructions for Architecture Decision Records
- [guide_corrections.md](./guide_corrections.md) — Instructions for Design Correction Records

#### Agent Instructions (by context)

- [agent_product.md](./agent_product.md) — Operating rules: product (DDD, Onboarding)
- [agent_architecture.md](./agent_architecture.md) — Operating rules: architecture
- [agent_engineering.md](./agent_engineering.md) — Operating rules: engineering
- [agent_adrs.md](./agent_adrs.md) — Operating rules: ADRs
- [agent_corrections.md](./agent_corrections.md) — Operating rules: cross-cutting design corrections

#### Agent Instructions (Implementation Mode profiles)

- [agent_scaffold.md](./agent_scaffold.md) — Project bootstrap from the approved documentation
- [agent_module_developer.md](./agent_module_developer.md) — Domain module implementation (Creation/Maintenance)
- [agent_code_reviewer.md](./agent_code_reviewer.md) — Read-only compliance and quality review
- [agent_integration_tester.md](./agent_integration_tester.md) — Validation of the running system against ACs and Business Rules

#### Reference Templates (`standard/templates/`)

- [AGENTS.md](./templates/AGENTS.md) — Agent entry-point stub for the repository root
- [project_status.yaml](./templates/project_status.yaml)
- [TODO.md](./templates/TODO.md)
- [correction.md](./templates/correction.md)
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

- `project/project_status.yaml` — Aggregate state of the project (single source of truth)
- `project/TODO.md` — Cross-module pending items
- `project/01_product/` — vision.md, roadmap.md, quality_attributes.md, domain_modules/
- `project/02_architecture/` — system_overview.md, data_flow.md, infrastructure.md
- `project/03_engineering/` — tech_stack.yaml, testing_strategy.md, api_guidelines.md
- `project/04_adrs/` — [NNNN]-[title].md
- `project/05_corrections/` — [NNNN]-[title].md (cross-cutting design corrections)

---

## Philosophy of the Standard

This standard is **designed with AI agents as its primary audience**. The directory structure, the modularization of documents, and the reading protocols are optimized so that an agent can understand the context of a software project efficiently, minimizing context window and token usage.

All documents must remain **human-readable** — humans are the ones who create, review, and approve the content. However, the design decisions of the standard (what to document, where to place it, how to structure it, and how to navigate it) prioritize interaction with AI agents.

> **Note on language:** The documentation language is up to each project's development team.

---

## Directory Structure

```text
/docs
├── standard/                              # The standard itself (instructions, rules, templates)
│   ├── README.md                          # This file (entry point)
│   ├── AGENT.md                           # Global operating instructions and session management
│   ├── AGENT_REVIEW.md                    # Documentation audit prompt (on demand)
│   ├── changelog.yaml                     # Version history of the standard
│   │
│   ├── guide_product.md                   # Structure and format of 01_product
│   ├── guide_domain_modules.md            # Structure and format of domain_modules
│   ├── guide_architecture.md              # Structure and format of 02_architecture
│   ├── guide_engineering.md               # Structure and format of 03_engineering
│   ├── guide_adrs.md                      # Structure and format of 04_adrs
│   ├── guide_corrections.md               # Structure and format of 05_corrections
│   │
│   ├── agent_product.md                   # Operating rules: product (DDD, Onboarding)
│   ├── agent_architecture.md              # Operating rules: architecture
│   ├── agent_engineering.md               # Operating rules: engineering
│   ├── agent_adrs.md                      # Operating rules: ADRs
│   ├── agent_corrections.md               # Operating rules: design corrections
│   │
│   ├── agent_scaffold.md                  # Implementation profile: project bootstrap
│   ├── agent_module_developer.md          # Implementation profile: module creation/maintenance
│   ├── agent_code_reviewer.md             # Implementation profile: compliance review (read-only)
│   ├── agent_integration_tester.md        # Implementation profile: validate the running system
│   │
│   └── templates/                         # Reference templates for agents
│       ├── AGENTS.md
│       ├── project_status.yaml
│       ├── TODO.md
│       ├── correction.md
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
    ├── project_status.yaml                # Aggregate state: module states, coverage, debt (source of truth)
    ├── TODO.md                            # Cross-module pending items discovered during implementation
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
    ├── 04_adrs/
    │   └── [NNNN]-[title].md              # Individual decision records
    └── 05_corrections/
        └── [NNNN]-[title].md              # Cross-cutting design correction records
```

---

## Adoption Guide

### New Project (Greenfield)

If the project has no code yet, fill out the documentation **before implementing**:

0. Copy `templates/AGENTS.md` to the repository root → Any AI agent that opens the repo finds its entry point on its own. (For tools that read `CLAUDE.md` or `GEMINI.md`, create a symlink or an identical copy.)
1. Copy `templates/vision.md` to `project/01_product/vision.md` → Define what will be built.
2. Create the necessary `domain_modules/` from `templates/domain_module.md`.
3. Copy `templates/roadmap.md` to `project/01_product/roadmap.md` → Prioritize the tasks.
4. Copy the architecture templates to `project/02_architecture/` → Design system_overview, data_flow, infrastructure.
5. Copy `templates/tech_stack.yaml` to `project/03_engineering/` → Choose technologies (with ADRs).
6. Copy `templates/testing_strategy.md` to `project/03_engineering/` → Testing strategy.
7. Copy `templates/project_status.yaml` and `templates/TODO.md` to `project/` → Initialize the status artifacts (every module starts as `pending`).
8. Implement the code following the documentation.

### Existing Project (Brownfield)

If the project already has code, document it through **reverse engineering**. The order is different — you start from the concrete (code) and move toward the abstract (product):

0. Copy `templates/AGENTS.md` to the repository root → Any AI agent that opens the repo finds its entry point on its own.
1. **`project/03_engineering/tech_stack.yaml`** → Analyze the code and record the actual technologies.
2. **`project/02_architecture/system_overview.md`** → Diagram the architecture that already exists.
3. **`project/02_architecture/infrastructure.md`** → Document where and how it runs.
4. **`project/01_product/vision.md`** → Describe what the product does and who it's for.
5. **`project/01_product/domain_modules/`** → Identify entities in the code and create modules with User Stories documented as already implemented (`state: done`).
6. **`project/01_product/roadmap.md`** → Use the board to plan what's **missing**: new features, refactors, bugs.
7. **`project/04_adrs/`** → Create retroactive ADRs (`status: accepted`) for the technical decisions already made.
8. **`project/project_status.yaml` and `project/TODO.md`** → Record each module's real state (and known debt), and any cross-module pending items detected during the analysis.

> **Tip:** An AI agent can dramatically speed up the brownfield path. It can analyze the source code and generate documentation drafts for human review. See `AGENT.md` for Onboarding Mode.

### Lite Mode (Minimal Adoption)

Full adoption is the right choice for products with several domain entities and a long life ahead. For small projects — prototypes, internal tools, single-purpose services — the full structure can be more ceremony than value. **Lite Mode** is the official minimal profile: three files that give an agent the minimum sufficient context to contribute safely.

| File | Why it is part of the minimum |
|---|---|
| `project/01_product/vision.md` | What is being built, for whom, and what is in/out of scope — prevents functionally wrong contributions. |
| `project/01_product/roadmap.md` | What to work on right now (Kanban board). |
| `project/03_engineering/tech_stack.yaml` | Technical guardrail: which technologies and versions are allowed. |

**Lite Mode rules:**

1. **Do not create the remaining files.** Empty placeholder files would signal an incomplete adoption (and trigger Onboarding Mode); their absence signals a deliberate Lite profile.
2. **User Stories and their ACs live directly on the roadmap board items**, since there are no `domain_modules/`.
3. **ADRs are recommended but optional.** The `adr` fields in `tech_stack.yaml` may be left empty (`""`) until the project upgrades.
4. **Declare the profile** in `AGENTS.md` (`Adoption profile: lite`), so agents and humans know the missing files are intentional.
5. Everything else in the standard (frontmatter, `[REQUIRED]` sections of the three files, traceability on the board) applies as usual.

**When to upgrade** — any of these signals means the project has outgrown Lite:

- A board item accumulates long functional detail or a User Story needs more than ~6 ACs → extract `domain_modules/`.
- A first cross-cutting process spans multiple entities → create `02_architecture/data_flow.md`.
- Technology decisions start getting re-litigated → create ADRs in `04_adrs/`.
- More than one developer or agent works concurrently → full structure with sessions.

**Upgrade path (incremental — no big bang):**

1. Run Knowledge Crunching (`agent_product.md`) to complete the Domain Entity Map in `vision.md`.
2. Extract the User Stories from the roadmap into `domain_modules/` files (one module per session, per `AGENT.md`).
3. Add `02_architecture/` and the remaining `03_engineering/` documents following the standard session order.
4. Create retroactive ADRs for the decisions already reflected in `tech_stack.yaml`.
5. Update `AGENTS.md` (`Adoption profile: full`).

Each step is independent: upgrade only what the project's complexity actually demands.

---

## Reading Protocol

Order in which a new agent should consume the documentation to get contextually oriented at the lowest token cost:

1. **`standard/AGENT.md`** → Understand the global operating rules.
2. **`project/project_status.yaml`** → Get the aggregate state of every module (and its known debt) at minimal token cost.
3. **`project/01_product/roadmap.md`** → Identify the current milestone/sprint and pick up the active task (`[In Progress]`).
4. **`project/01_product/domain_modules/[affected_module].md`** → Read **ONLY** the module (or modules) directly referenced by the chosen active task. Check `project/TODO.md` for pending items that affect them.
5. **`project/02_architecture/system_overview.md`** → Understand where that module fits within the overall system.
6. **`project/03_engineering/tech_stack.yaml`** → Know the technical boundaries before generating or modifying code.
7. *(Optional)* **`project/04_adrs/`** and **`project/01_product/vision.md`** → Consult the decision history or product vision only when blocked or facing directional questions during development.

---

## Maintenance Protocol

1. **Do not create files outside the defined structure.** Every new file must be placed in the corresponding `project/` directory according to its nature (product, architecture, engineering, or ADR).
2. **Do not modify the directory structure** without recording an ADR that justifies the change.
3. **New domain modules** must be created from the `standard/templates/domain_module.md` template, following the structure defined in `standard/guide_domain_modules.md`, completing all required sections.
4. **Every accepted ADR** that modifies a technical standard **must** be reflected by updating the corresponding file in `project/03_engineering/`.
5. **When adding or removing files**, update the Table of Contents in this file.
6. **Sections marked [REQUIRED]** may not be removed or left empty.
7. **Every new document** must include the YAML frontmatter corresponding to its type (see next section).
8. **Code↔docs synchronization** is governed by the **Anti-Drift Protocol** in `AGENT.md` (Global Rules → Traceability and Synchronization): each triggering event (task started/completed, new dependency, accepted ADR, infrastructure change...) lists the documentation update required in the same change.

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

## Project Status Artifacts

Two machine-readable artifacts at the root of `project/` centralize the project's operational state, so agents can know where the project stands without parsing full documents. They are part of the **full** adoption profile (Lite projects skip them).

### `project_status.yaml` — Aggregate State

The **single source of truth for module state**. It records, per module: its `state`, its test coverage, and its known technical debt.

```yaml
last_updated: YYYY-MM-DD

modules:
  clients:
    state: done              # pending | doing | done | deprecated
    coverage: 97             # [OPTIONAL] test coverage %
    debt:                    # [OPTIONAL] known technical debt
      - "Pagination missing on the list endpoint"
  orders:
    state: doing
```

**Authority rule:** for module state, this file is authoritative. The `state` field in each module's frontmatter and the Kanban board in `roadmap.md` are **views** that must never contradict it. Any state change updates all three in the same change (see the Anti-Drift Protocol in `AGENT.md`); automated tooling may verify their consistency. The current phase/milestone is **not** recorded here — `roadmap.md` owns it.

### `TODO.md` — Cross-Module Pending Items

A living list of **fine-grained tasks discovered while working on one module that affect another** (e.g., "when `orders` is implemented, add the reverse relation in `clients`"). This is **not the backlog**: planned work (User Stories, features, bugs) lives on the `roadmap.md` board. `TODO.md` holds the small, concrete stubs that would otherwise be lost in conversation.

Lifecycle: add an entry when the pending item is discovered; remove it when resolved (git preserves the history). Before working on a module, check whether any entry affects it.

---

## Principles of the Standard

1. **Modularity (Modular PRD)**: Functional requirements are not a centralized list; they live inside their corresponding domain module (`domain_modules/`). Each module is a mini-PRD.
2. **Self-description**: Each area of the standard has a `guide_*.md` explaining what files it contains and how to create and maintain them, plus an `agent_*.md` with operating rules for agents.
3. **Outcome-Oriented Writing**: Rigid "The system shall..." lists are avoided. **User Stories** capture business value and **Acceptance Criteria (AC)** drive validation.
4. **Design Docs**: The `project/02_architecture/` folder acts as the Design Doc repository, describing the technical solution to the requirements defined at the product level.
5. **Minimum Sufficient Context**: The documentation is structured so an AI agent can read only what it needs for a specific task without flooding its context.
6. **Traceability**: Architectural decisions (ADRs) are reflected in engineering (`project/03_engineering/`) whenever they modify technical standards.
7. **Docs as Code**: Documentation files live alongside the source code, are versioned with Git, and are maintained as part of the development workflow.
8. **Single Canonical Source**: every rule or concept of the standard is specified in exactly one document; all other documents reference it instead of restating it. This keeps token cost low and prevents copies from drifting apart.

---

## Project Conventions

A project's own conventions — documentation language, adoption profile (`full`/`lite`), and any date-format or writing-style choices — live in the adopting repository's root `AGENTS.md`, not here. This file is the standard itself: it is replaced wholesale when the standard is updated, so nothing project-specific belongs in it. Date format defaults to `YYYY-MM-DD`.

---

## Version History

<!-- [REQUIRED] Structured record of changes to the standard. -->

See [changelog.yaml](./changelog.yaml) for the full version history.

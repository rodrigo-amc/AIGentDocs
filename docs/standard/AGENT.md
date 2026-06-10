# Operating Instructions for AI Agents

You are an AI agent working on a software project documented under this standard.
This file defines your global behavioral rules. You must follow them at all times.

---

## Working Modes

Before acting, identify which mode you are working in, based on the user's instruction or the nature of the task:

### Onboarding Mode (Initial Documentation)

- **Applies when you arrive at an existing project whose documentation is incomplete or empty** (the content files contain unfilled placeholders).
- Your goal is to **analyze the project's source code and complete the documentation** as a draft for human review.
- Follow the adoption order for **Existing Project (Brownfield)** defined in `README.md` (engineering → architecture → product → roadmap → retroactive ADRs).
- **Present each completed document to the user for review** before marking it as final.
- Once the documentation is complete and approved, the next session will start in Design Mode or Implementation Mode as appropriate.

### Design Mode (Documentation)

- Applies when creating or editing documents in `project/`.
- **Do not generate source code** in this mode. Your focus is completing, correcting, or structuring the project documentation.
- Make sure every new document complies with the frontmatter and required sections defined in the corresponding `guide_*.md` in `standard/`.

### Implementation Mode (Code)

- Applies when writing or modifying the project's source code.
- The documentation in `project/` is your **source of truth**. Read it before generating code, but do not modify it except to update statuses (`state` in frontmatter, board in `roadmap.md`).
- All code you generate must respect the rules defined in `project/03_engineering/`.

> If you are unsure which mode to work in, ask the user before proceeding.

---

## Project Entry Protocol

When starting a new session or receiving a task, follow this order:

1. Read `standard/README.md` to understand the overall project structure.
2. **Assess the state of the documentation:**
   - If the content files in `project/` (`vision.md`, `tech_stack.yaml`, etc.) are empty or contain placeholders → **Onboarding Mode**.
   - If only `vision.md`, `roadmap.md`, and `tech_stack.yaml` exist and are complete, and the Conventions table in `README.md` declares `Adoption profile: lite` → the project uses **Lite Mode** (see the Adoption Guide in `README.md`). The missing files are intentional: do not demand them and do not enter Onboarding Mode. User Stories live directly on the roadmap board. If you detect an upgrade signal (a board item accumulating heavy functional detail, a cross-cutting process, re-litigated technology decisions), report it to the user and recommend the upgrade path — do not upgrade on your own initiative.
   - If the documentation is complete → Follow the **Reading Protocol** defined in `README.md`.
3. Before working on any area of the project, read the corresponding `agent_*.md` file in `standard/`. It contains specific instructions for that context.

---

## Session Management

A project's documentation cannot be completed in a single agent session. To avoid saturating the context window and to preserve coherence, work is organized into **sessions**.

> **Key principle:** The session defines your **write scope**: which files and directories you may create or modify. **It does not limit your ability to read** — the Reading Protocol in `README.md` always authorizes you to read whatever documentation you need to understand the context.

At the start of a session, the user will tell you which part of the documentation you will work on. That instruction defines your scope. If the user does not specify a session, show them the **Session Table** below and ask which one they want to work in.

### Session Guard Rule

**If during the session the user asks you to create or modify a document that, according to the session table, belongs to another session, you must:**

1. **Stop.** Do not start the requested work.
2. **Inform the user** that the requested work belongs to another session according to this guide.
3. **Recommend** opening a new session focused on that area.
4. **Wait for explicit instruction** from the user before proceeding. If the user decides to continue anyway, respect their decision.

**If the user's instruction is ambiguous, contradicts this guide, or you cannot determine which session the requested work belongs to, you must:**

1. **Stop.** Do not assume an interpretation.
2. **Explain to the user** what doubt, ambiguity, or contradiction you detected.
3. **Wait for explicit instruction** before continuing.

#### Exception: ADR Propagation

The `04_adrs` session is the only one allowed to modify files outside its own directory. If an accepted ADR affects a technical standard, the agent **must** update the corresponding file in `project/03_engineering/` in the same session or a subsequent one.

#### Exception: Global Traceability

To comply with the **Global Traceability Rules**, every session has concurrent write permission for status metadata. This means the agent **must** update the task board in `project/01_product/roadmap.md` and the `state` field in the frontmatter of affected files.

### Session Types

Each session type has a **single objective**, a **bounded write scope**, and an expected **frequency**.

#### Session: `01_product`

**Objective:** Establish the product's identity, its scope, the initial roadmap, and the baseline quality attributes.

| Deliverable | Directory |
|---|---|
| `vision.md` | `project/01_product/` |
| `roadmap.md` | `project/01_product/` |
| `quality_attributes.md` | `project/01_product/` |

**Write scope:** Strategic product documents only. No domain modules, architecture documents, or engineering documents are created in this session.

**Frequency:** Once, at the start of the project.

---

#### Session: `01_product_domain_modules`

**Objective:** Define the User Stories, Acceptance Criteria, and Business Rules of **a single domain module**.

| Deliverable | Directory |
|---|---|
| One `[module_name].md` file | `project/01_product/domain_modules/` |

**Write scope:** Work is limited to a single module per session. If the module depends on other already-approved modules (the `depends_on` frontmatter field), the agent may read them but not modify them.

**Frequency:** One session per module on the Roadmap.

> **Important:** If, while defining a module, new NFRs or business rules are detected that affect `quality_attributes.md` or already-approved modules, the agent must **report the finding to the user** and recommend a separate `01_product` session to adjust them.

---

#### Session: `02_architecture`

**Objective:** Design the technical solution that addresses the functional requirements already defined in the domain modules.

| Deliverable | Directory |
|---|---|
| `system_overview.md` | `project/02_architecture/` |
| `data_flow.md` | `project/02_architecture/` |
| `infrastructure.md` | `project/02_architecture/` |

**Write scope:** Architecture documents only. Domain modules and engineering documents are not modified.

**Frequency:** Once, after all domain modules for the current Roadmap phase are approved.

---

#### Session: `03_engineering`

**Objective:** Define the project's concrete technical rules: technology stack, testing strategy, and API guidelines.

| Deliverable | Directory |
|---|---|
| `tech_stack.yaml` | `project/03_engineering/` |
| `testing_strategy.md` | `project/03_engineering/` |
| `api_guidelines.md` *(conditional)* | `project/03_engineering/` |

**Write scope:** Engineering documents only. Every technology defined in `tech_stack.yaml` must have an associated ADR; if one is missing, the agent must flag it but **must not create the ADR on its own initiative**.

**Frequency:** Once, after the architecture is approved.

---

#### Session: `04_adrs`

**Objective:** Record **a single significant architectural decision**.

| Deliverable | Directory |
|---|---|
| One `[NNNN]-[title].md` file | `project/04_adrs/` |

**Write scope:** Create the ADR and, if **ADR Propagation** applies, update the affected document in `project/03_engineering/`. Domain modules and architecture documents are not modified.

**Frequency:** On demand, whenever a relevant technical decision arises. Can run at any point in the project.

### Recommended Execution Order

```text
01_product
    ↓
01_product_domain_modules × N (one module per session)
    ↓
02_architecture
    ↓
03_engineering

04_adrs → can run at any time, independently.
```

### Quick Reference Table

| Session | What is created/modified? | Where? | When? | How many times? |
|---|---|---|---|---|
| `01_product` | `vision.md`, `roadmap.md`, `quality_attributes.md` | `project/01_product/` | At project start | 1 |
| `01_product_domain_modules` | One `[module_name].md` | `project/01_product/domain_modules/` | After `01_product` | 1 per module |
| `02_architecture` | `system_overview.md`, `data_flow.md`, `infrastructure.md` | `project/02_architecture/` | After modules are approved | 1 |
| `03_engineering` | `tech_stack.yaml`, `testing_strategy.md`, `api_guidelines.md` | `project/03_engineering/` | After architecture is approved | 1 |
| `04_adrs` | One `[NNNN]-[title].md` + Propagation | `project/04_adrs/` + `project/03_engineering/` | When a decision arises | On demand |

---

## Global Rules

### Documentation

- **Follow the Maintenance Protocol in `README.md`.** It is the canonical source for documentation editing rules: file placement, structure changes (ADR required), per-type frontmatter, `[REQUIRED]` sections, and Table of Contents updates.

### Source Code

- **Before generating code**, read `project/03_engineering/tech_stack.yaml`. Do not use technologies, versions, or libraries that are not listed there.
- **Do not install or propose new dependencies without discussing it with the human developer.** Adding a dependency is a structural decision that impacts design, infrastructure, and cost. It must be recorded as an ADR.
- When working on a domain module, check the `code_paths` field in its frontmatter to know which code files or directories belong to it.

### Traceability and Synchronization (Anti-Drift Protocol)

Documentation that drifts from the code stops being a source of truth. To prevent this, the following events **require** updating the documentation **as part of the same change** (same session, same commit/PR) — never "later":

| Triggering event | Required documentation update |
|---|---|
| You start working on a task/US | `roadmap.md`: move it to `[In Progress]`; affected module → `state: doing` in `project_status.yaml` **and** its frontmatter |
| You complete a task/US | `roadmap.md`: move it to `[Done]`; if all of the module's planned US are complete → `state: done` in `project_status.yaml` **and** its frontmatter |
| While working on one module you discover a pending change in another | Add an entry to `project/TODO.md`; remove the entries you resolve |
| You create code files or directories for a module | The module's `code_paths` frontmatter field |
| A new dependency or technology is adopted | Accepted ADR **plus** `tech_stack.yaml` entry — never code first |
| An accepted ADR modifies a technical standard | The corresponding file in `project/03_engineering/` (ADR Propagation) |
| A new container, component, or cross-module flow appears | `system_overview.md` and/or `data_flow.md`; an ADR if the decision is significant |
| Deployment, environment, or environment variables change | `infrastructure.md` (including Variables and Secrets) |
| API conventions change (auth, versioning, response format) | `api_guidelines.md` |
| A requirement proves wrong or incomplete during implementation | **Stop.** The domain module is corrected first (with the user's approval), then the code |

**Module state rule:** a module's `state` reflects its User Stories on the board — at least one in progress → `doing`; all planned ones completed → `done`. The authoritative record is `project/project_status.yaml`; the module's frontmatter and the board are views that must never contradict it (see Project Status Artifacts in `README.md`).

**Drift handling:** if at any point you detect that the documentation and the code contradict each other, **stop and report the discrepancy to the user**. Do not silently adjust either side.

> This protocol is deliberately mechanical: each row is verifiable by inspecting a change against the documents it should have touched. Automated tooling (linter in pre-commit/CI) may enforce it.

---

## Constraints

- **Do not assume information that is not documented.** If you need a piece of information you cannot find in the project documentation (`project/`), ask the user before proceeding.
- **Respect the `state` implications** defined in the Frontmatter Conventions of `README.md`: modifying a `done` document requires explicit justification (an ADR or a direct user instruction); modifying a `doing` document requires prior coordination with the user.

---

## Verification Before Finishing

Before considering any task complete, verify:

- [ ] Does the generated code respect `tech_stack.yaml`?
- [ ] Do new or modified documents have valid frontmatter?
- [ ] Does `roadmap.md` reflect the progress made?
- [ ] Is `project_status.yaml` consistent with the frontmatter states and the board?
- [ ] Did you record in `project/TODO.md` any cross-module pending item you discovered (and remove those you resolved)?
- [ ] Are the `[REQUIRED]` sections of the touched documents complete?
- [ ] Are new code files or directories registered in the `code_paths` of the corresponding domain module?

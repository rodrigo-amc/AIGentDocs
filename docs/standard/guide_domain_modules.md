---
type: standard_guide
scope: domain_modules
version: 1.2
last_updated: 2026-06-10
project_path: "project/01_product/domain_modules/"
required_files: []
optional_files: []
---

# domain_modules — Domain Modules

This directory contains one markdown file per **Aggregate or Domain Module** of the project. Each module is **independent and self-contained**, and may represent a single **Entity** or a group of tightly cohesive Entities that share business rules and a transactional lifecycle (e.g., the `inventory.md` module groups the `article` and `direct_sale` entities).

---

## How to create a new domain module

1. Create a new `.md` file in this directory named after the module or main entity, in lowercase (e.g., `clients.md`, `inventory.md`, `orders.md`).
2. Write the content following the structure defined in the **"Structure of a Domain Module"** section of this document.
3. Complete every section marked **[REQUIRED]**.
4. Update the Table of Contents in `standard/README.md`.

## How to update an existing module

1. Open the corresponding module file.
2. Edit the sections that need changes directly.
3. Do not remove **[REQUIRED]** sections or leave them empty.
4. If new relationships to other modules are added, verify that the referenced modules are also up to date.

---

## Structure of a Domain Module

Every domain module file must contain the following sections, in this order:

### Frontmatter

```yaml
---
type: domain_module
module_name: ""      # Name of the module or aggregate (e.g., inventory, sales)
entities: []         # List of contained entities (e.g., ["article", "direct_sale"])
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
depends_on: []       # Related modules (e.g., [orders, invoices])
code_paths: []       # Paths to code directories/files (e.g., ["/src/clients/"])
---
```

> *Note on `state`: The module's overall state is defined by its current iteration. If at least one User Story is active on the roadmap, the module's state is `doing`. If all of its current requirements are finished, it moves to `done`.*

### Header

```markdown
# [Module Name]

> Purpose of this module or aggregate in one line.
```

### Module Sections

| Section | Type | Description |
|---|---|---|
| Description | **[REQUIRED]** | What this module and its entities represent in the business context. |
| Attributes / Properties | **[REQUIRED]** | List of fields with name, data type, and description. |
| User Stories | **[REQUIRED]** | Functional requirements in the format: "As a [role], I want [action], so that [value]". |
| AC (Acceptance Criteria) | **[REQUIRED]** | List of verifiable conditions for each User Story. |
| Business Rules | **[REQUIRED]** | Validations, constraints, and invariants of the contained entities. |
| Lifecycle | **[OPTIONAL]** | Possible states and transitions (e.g., Draft → Active). |
| Relationships | **[REQUIRED]** | Connections to other modules and business dependencies. |

---

## Cross-Cutting Requirements (Option C)

For processes that involve multiple modules (e.g., a "Sale" that affects Orders, Clients, and Stock), we follow the **Modularized Responsibility** approach:

1. **Each module documents its part**: In its User Stories section, the module describes the functional impact on itself.
2. **References**: If a process requires another module to react, it is specified in the ACs.
   * *Example in `orders.md`*: "AC: On confirmation, the stock reservation defined in `stock.md` must be invoked".
3. **Global view**: The complete flow of the cross-cutting process is visualized through diagrams in `project/02_architecture/data_flow.md`, referencing each module's stories.

---

## Fill-Out Guide (Modular PRD)

1. **Define the Module and Entities**: Identify what data the aggregate manages.
2. **Write the Stories**: Think about the value to the end user. Avoid purely technical descriptions like "the button saves data".
3. **Set Success Criteria (AC)**: They must be clear enough that a developer or an AI could write a test from them.
    * *Bad AC*: "The process must be fast".
    * *Good AC*: "The system must respond in under 500 ms at a load of 100 requests/sec".

---

## Size and Granularity Guidelines (Heuristics)

To avoid monolithic user stories or unmanageable modules (which hurt both AI context and human-team agility), apply the following "soft limit" heuristics. If an analyst (human or AI agent) detects that these limits are exceeded, **they must stop and propose splitting the requirement**.

### Heuristics for User Stories (US)
* **Acceptance Criteria (AC) limit:** If a US has **more than 6 ACs**, it likely contains complex alternative flows that deserve their own US. This is not a hard limit, though. (Note: this applies to the volume of detail of one piece of functionality on a specific Entity, not to the whole file.) If an AI agent detects a US with more than 6 ACs, it must **stop, warn the human developer, and offer these options**:
  1. Split the US into smaller stories.
  2. Extract complex validations into the corresponding entity's "Business Rules" section.
  3. Explicitly approve keeping the US as is, if the human considers it logically indivisible.
* **Purpose limit (SRP):** A US must represent a single, continuous business goal. If the US includes "User registration, email validation, and initial profile setup", split it into three separate stories.
* **Concurrent dependency limit:** If implementing a US requires modifying the logic of **more than 2 Domain Modules concurrently**, split it focusing on per-module deliverables, or redesign the flow's architecture.

### Heuristics for Domain Modules (Aggregates)
* **Semantic extension limit:** There is no numeric line limit for a module, since its history will grow. Instead, the limit is **semantic and conceptual**. A domain module must not become a "God Object". If you notice a module grouping Entities that do not share strict business rules or simultaneous lifecycles (e.g., mixing Billing into the Clients module instead of having `invoices.md`), you must stop, inform the user of the cohesion failure (a violation of the Aggregate concept), and propose extracting that Entity into its own Domain Module.

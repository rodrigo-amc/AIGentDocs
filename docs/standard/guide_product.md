---
type: standard_guide
scope: product
version: 1.2
last_updated: 2026-06-10
project_path: "project/01_product/"
required_files: [vision.md, roadmap.md, quality_attributes.md]
optional_files: []
---

# 01_product — Product Context

This directory contains the project's business intelligence. It is essential for agents to understand *what* they are programming *for*, and to avoid solutions that are technically valid but functionally wrong.

---

## Files in this directory

### `vision.md` — Product Vision (Strategic PRD)

Defines the project's "why" at a global level. It is the **high-level PRD** that establishes the strategic goals before getting into the tactical detail of the modules.

| Section | Type | Description |
|---|---|---|
| Elevator Pitch | **[REQUIRED]** | What the product is, in 2-3 lines. Must answer: What does it do? Who is it for? What problem does it solve? |
| Problem It Solves | **[REQUIRED]** | Description of the user pain or need that motivates the project's existence. |
| Target Users (Personas) | **[REQUIRED]** | Profiles of the system's users: who they are, what role they play, what their technical level is. |
| Project Scope | **[REQUIRED]** | What is **in** scope and what is **out** of scope. Prevents the agent from implementing unplanned functionality. |
| Domain Glossary | **[REQUIRED]** | Unified business terminology (Ubiquitous Language per DDD). Terms are discovered during the Knowledge Crunching process defined in `agent_product.md`. |
| Domain Entity Map | **[REQUIRED]** | Entities discovered through Knowledge Crunching (DDD). Each entity includes: canonical name, 1-2 line description, and high-level relationships to other entities. This map is the source for creating files in `domain_modules/`. Do not include detailed attributes or business rules — those live in the corresponding module. |
| Business Model | **[OPTIONAL]** | How the product generates value. |
| Business Constraints | **[OPTIONAL]** | Legal, regulatory, or contractual limitations. |

**Expected frontmatter:**

```yaml
---
type: vision
version: 1.0
last_updated: YYYY-MM-DD
change_summary: ""   # Brief summary of the changes in this version
---
```

---

### `roadmap.md` — Status and Planning

Provides temporal context and task prioritization. It works as a **Kanban board** so developers and AI agents know exactly what to work on, coordinating with the states of the `domain_modules/`.

| Section | Type | Description |
|---|---|---|
| Current Phase/Milestone | **[REQUIRED]** | Macro context of current development (e.g., "MVP", "Sprint 2"). |
| Task Board | **[REQUIRED]** | Actionable list of User Stories or technical tasks. |
| Upcoming Milestones | **[OPTIONAL]** | Long-term view of what comes after the current milestone. |

**Task Board rules (Kanban):**
- **`[In Progress]`**: The task currently in development. At most 1 or 2 items. This is the absolute focus.
- **`[To Do / Next]`**: Backlog strictly prioritized top to bottom. If `In Progress` is empty, take the top item.
- **`[Blocked / Review]`**: Tasks stopped by external blockers or awaiting review.
- **`[Done]`**: Completed tasks for the current milestone.

*Note: The roadmap interacts through references (e.g., `[US-03] Implement login (see clients.md)`). Functional details always live in the domain module.*

**Expected frontmatter:**

```yaml
---
type: roadmap
version: 1.0
last_updated: YYYY-MM-DD
current_phase: ""    # Current project phase (e.g., "MVP", "Beta", "Production")
---
```

### `quality_attributes.md` — Non-Functional Requirements

Centralizes the system's quality attributes (performance, security, availability, etc.). It defines the standard for "how" the system must behave under certain conditions (NFRs). These requirements act as business constraints that shape the architecture.

| Section | Type | Description |
|---|---|---|
| Performance | **[REQUIRED]** | Expected response times, latency, and throughput under load. |
| Security | **[REQUIRED]** | Authentication, authorization, encryption in transit/at rest, threat protection (OWASP). |
| Usability | **[OPTIONAL]** | Ease of use, accessibility (WCAG), and learning curve. |
| Availability | **[OPTIONAL]** | Uptime (SLAs), fault tolerance, and disaster recovery. |
| Scalability | **[OPTIONAL]** | Ability to grow as demand increases. |
| Maintainability | **[OPTIONAL]** | Ease of modifying the system without introducing errors. |

**Structure of a Quality Attribute:**

Each attribute must be documented using the **Quality Attribute Scenario** format:

1. **Stimulus Source**: Who generates the event (user, system, attacker).
2. **Stimulus**: The event itself (data request, brute-force attack, server failure).
3. **Environment**: Conditions under which it occurs (normal load, traffic spike, maintenance mode).
4. **Response**: What the system must do.
5. **Response Measure**: The verifiable metric (e.g., "in under 2 seconds", "block the IP after 3 attempts").

**Expected frontmatter:**

```yaml
---
type: quality_attributes
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
---
```

**Fill-out guide:**
- **New project:** Define at least the Performance and Security attributes before implementing.
- **Existing project:** Quality attributes must be reviewed whenever an ADR significantly impacts system behavior.
- **Validation:** Each response measure should be linked to a test in `testing_strategy.md`.

---

### `domain_modules/` — Domain Modules (Modular PRD + Backlog)

This is the level where **detailed functional requirements** live. Each module file works as a "Modular PRD" and a "Backlog" for the entity.

See `guide_domain_modules.md` for instructions on documenting **User Stories** and **Acceptance Criteria (AC)** per module.

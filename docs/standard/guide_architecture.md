---
type: standard_guide
scope: architecture
version: 1.4
last_updated: 2026-06-10
project_path: "project/02_architecture/"
required_files: [system_overview.md, data_flow.md, infrastructure.md]
optional_files: []
---

# 02_architecture — System Architecture (Design Docs)

This directory acts as the repository of the project's technical **Design Docs**. Its job is to describe the **"how"** (the technical solution) that addresses the requirements defined in the modular PRDs of `project/01_product/`.

---

## The Role of the Design Doc in the Standard

1. **Technical Solution**: The content here does not repeat the User Stories; it designs the architecture, the data model, and the infrastructure needed to implement them.
2. **Global View**: When a functional process spans multiple modules (Modularized Responsibility), this directory provides the connective tissue through Mermaid sequence diagrams.
3. **AI Readability**: Mermaid diagrams are preferred over long paragraphs of technical prose.

---

## Files in this directory

### `system_overview.md` — System Overview

High-level map of the architecture.

| Section | Type | Description |
|---|---|---|
| Context Diagram (C4 Level 1) | **[REQUIRED]** | The system ↔ external actors. |
| Container Diagram (C4 Level 2) | **[REQUIRED]** | Applications, databases, and services. |
| Folder Structure | **[REQUIRED]** | Explanation of the purpose of the code's folders. |
| Architectural Patterns | **[REQUIRED]** | MVC, Clean Architecture, etc. |

**Expected frontmatter:**

```yaml
---
type: system_overview
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
---
```

---

### `data_flow.md` — Data Flows and Global View

Documents the movement of information and the orchestration between modules.

| Section | Type | Description |
|---|---|---|
| Global Process View | **[REQUIRED]** | Mermaid diagrams that tie together User Stories from multiple modules. |
| Data Model | **[REQUIRED]** | Entities and relationships (Mermaid erDiagram). |
| Messaging/Events | **[OPTIONAL]** | Queues, Pub/Sub, Webhooks. |

**Expected frontmatter:**

```yaml
---
type: data_flow
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
modules_covered: []  # Modules involved (e.g., [orders, clients, stock])
---
```

---

### `infrastructure.md` — Infrastructure and Deployment

Documents the environment where the system runs.

| Section | Type | Description |
|---|---|---|
| Environment | **[REQUIRED]** | Cloud, on-premise, etc. |
| Deployment Diagram | **[REQUIRED]** | Network and server topology. |
| CI/CD | **[REQUIRED]** | Deployment pipeline. |
| Variables and Secrets | **[REQUIRED]** | List of required variables. |

**Expected frontmatter:**

```yaml
---
type: infrastructure
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
environment: ""      # cloud | on-premise | hybrid
---
```

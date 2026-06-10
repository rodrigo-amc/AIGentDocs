---
type: standard_guide
scope: engineering
version: 1.2
last_updated: 2026-06-10
project_path: "project/03_engineering/"
required_files: [tech_stack.yaml, testing_strategy.md]
optional_files: [api_guidelines.md]
---

# 03_engineering — Engineering and Implementation

This directory defines the technical rules of the game and the quality standards. It acts as a "guardrail" to prevent agents from using outdated libraries, unwanted code patterns, or generating inconsistent tests.

> **ADR Interaction Rule:** Every ADR with **Accepted** status that modifies a technical standard (stack, testing, API) **must** be reflected by updating the corresponding file in this directory. The ADR records the historical **"why"**; this directory holds the current **"what"**. See `guide_adrs.md` for details.

---

## Files in this directory

### `tech_stack.yaml` — Technology Stack

> **Format exception:** This is the only file in the standard that does not use markdown. It uses plain YAML for maximum parsing efficiency by AI agents. A developer can read it directly; a non-technical user can ask the agent to describe its contents.

Defines the project's exact technologies in a **declarative YAML format**, optimized for an agent to consume before generating code. It acts as a technical guardrail: the agent knows what to use, which version, and what is forbidden.

**File sections:**

| Section | Type | Description |
|---|---|---|
| `backend` | **[REQUIRED]** | Language, version, framework, ORM, and dependency manager. |
| `frontend` | **[REQUIRED]** | Framework/library, version, bundler, and package manager. |
| `database` | **[REQUIRED]** | Engine, version, and driver/connector in use. |
| `infrastructure` | **[OPTIONAL]** | Application server, containers, cloud provider. |
| `dev_tools` | **[OPTIONAL]** | Linters, formatters, pre-commit hooks. |
| `global_constraints` | **[REQUIRED]** | Explicitly forbidden technologies or practices. |

**Schema for each technology:**

| Field | Type | Description |
|---|---|---|
| `name` | **[REQUIRED]** | Name of the technology. |
| `version` | **[REQUIRED]** | Exact version or allowed range. |
| `adr` | **[REQUIRED]** | Reference to the ADR that justifies the choice. Every technology in the stack must have an associated ADR. |
| `note` | **[OPTIONAL]** | Brief context about the choice or constraint. |

**Example:**

```yaml
backend:
  language:
    name: Python
    version: "3.11"
    adr: "0002-use-python-3.md"
  framework:
    name: Django
    version: "4.2 LTS"
    note: "LTS version is used to guarantee extended support."
    adr: "0003-use-django-as-framework.md"
  orm:
    name: Django ORM
    version: "4.2"
    adr: "0003-use-django-as-framework.md"
  dependency_manager:
    name: pip
    version: "23.x"
    adr: "0002-use-python-3.md"

database:
  engine:
    name: PostgreSQL
    version: "15"
    adr: "0004-use-postgresql.md"

global_constraints:
  - "Do not use SQLAlchemy or any ORM other than Django's."
  - "Do not install dependencies without recording an ADR."
```

**Fill-out guide:**
- **New project:** Define at least `backend`, `database`, and `global_constraints` before writing code. Every technology must have its ADR created in `project/04_adrs/`.
- **Existing project:** Verify that the file reflects the reality of the repository. Every technology addition or change must be updated here and have its corresponding ADR.

---


### `testing_strategy.md` — Testing Strategy

Defines how the software is validated. Without this guide, the agent may generate inconsistent tests or put them in the wrong places.

| Section | Type | Description |
|---|---|---|
| Required Test Types | **[REQUIRED]** | Which test types are used: unit, integration, E2E, etc. |
| Testing Tools | **[REQUIRED]** | Frameworks and runners: pytest, Jest, Playwright, etc. |
| Minimum Expected Coverage | **[REQUIRED]** | Target coverage percentage and acceptance criteria. |
| Test File Structure | **[REQUIRED]** | Where to place tests, file and folder naming (e.g., `tests/unit/`, `tests/integration/`). |
| Test Data / Fixtures | **[OPTIONAL]** | How to handle mocks, fixtures, and test data. |
| Local vs CI Execution | **[OPTIONAL]** | Differences between running tests locally and in the CI pipeline. |

**Expected frontmatter:**

```yaml
---
type: testing_strategy
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
---
```

**Fill-out guide:**
- **New project:** Define at least the test types and the file structure before starting to implement.
- **Existing project:** Verify that the documented strategy matches the reality of the repository.

---

### `api_guidelines.md` — API Guidelines

> **CONDITIONAL:** This file is required only in projects that expose endpoints (REST API, GraphQL, gRPC, etc.). It does not apply to monolithic projects with an integrated frontend that expose no programmatic interfaces (e.g., Django with its template engine, Rails with server-side views). If the project exposes no endpoints, this file is not created.

Defines the communication standards between components and with the outside world. It guarantees consistency in HTTP interfaces and naming.

| Section | Type | Description |
|---|---|---|
| API Standard | **[REQUIRED]** | API type: REST, GraphQL, gRPC, or other. |
| Endpoint Conventions | **[REQUIRED]** | Naming, versioning, and URL structure (e.g., `/api/v1/resource`). |
| Request/Response Format | **[REQUIRED]** | Standard JSON structure, response envelopes, HTTP status codes, error format. |
| Authentication and Authorization | **[REQUIRED]** | Mechanism in use: JWT, OAuth 2.0, API keys, etc. |
| API Documentation | **[OPTIONAL]** | If OpenAPI/Swagger is used: where it is generated and how it is maintained. |
| Rate Limiting and Pagination | **[OPTIONAL]** | Throttling policies, request limits, and pagination strategy. |

**Expected frontmatter:**

```yaml
---
type: api_guidelines
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
api_type: ""         # REST | GraphQL | gRPC
---
```

**Fill-out guide:**
- **New project:** Define the API standard and the response format before implementing the first endpoint.
- **Existing project:** Update whenever new communication patterns are added or the authentication mechanism changes.

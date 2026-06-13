---
description: Start an AIGentDocs documentation session with its write scope
argument-hint: 01_product | 01_product_domain_modules | 02_architecture | 03_engineering | 04_adrs | 05_corrections
---

You are starting an AIGentDocs documentation session of type: **$ARGUMENTS**

1. If you haven't already read it this conversation, read `docs/standard/AGENT.md` — it defines the Session Guard Rule, the Anti-Drift Protocol, and the Operational Patterns that govern you.
2. Read the files for this session type and adopt the agent profile they define:

| Session | Read | Write scope |
|---|---|---|
| `01_product` | `docs/standard/agent_product.md` + `guide_product.md` | Strategic product docs only |
| `01_product_domain_modules` | `agent_product.md` + `guide_domain_modules.md` | Exactly one module file |
| `02_architecture` | `agent_architecture.md` + `guide_architecture.md` | `02_architecture/` only |
| `03_engineering` | `agent_engineering.md` + `guide_engineering.md` | `03_engineering/` only |
| `04_adrs` | `agent_adrs.md` + `guide_adrs.md` | One new ADR + ADR Propagation |
| `05_corrections` | `agent_corrections.md` + `guide_corrections.md` | The approved Impact Map, nothing else |

3. Announce the session type and its write scope to the user, then ask which specific document to work on (Session Focus rule).
4. Respect the Session Guard: anything outside this session's write scope means stop, inform, and recommend the right session.

If no argument was given, show the table and ask which session to start.

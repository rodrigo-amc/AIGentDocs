---
description: Onboarding Mode — reverse-engineer an existing codebase into AIGentDocs documentation
---

You are entering **Onboarding Mode** of the AIGentDocs standard: this project has code but its documentation is missing or empty.

1. Read `docs/standard/PROTOCOL.md` (Onboarding Mode section) — it governs this whole flow.
2. Verify the precondition: content files under `docs/project/` are absent or placeholders. If the docs look complete, stop and tell the user onboarding doesn't apply.
3. Follow the Brownfield order from `docs/standard/README.md` (Adoption Guide): engineering → architecture → product → roadmap → retroactive ADRs. Before working each area, read its `docs/standard/agent_*.md`.
4. Use parallel read-only subagents to analyze the codebase (Operational Patterns: subagents read, you write).
5. **Present each completed document to the user for review before moving on.** You generate, the human approves — no document is final without review.
6. Close by initializing `docs/project/project_status.yaml` and `TODO.md` with the real state of each module, and running `npx aigentdocs lint` to verify compliance.

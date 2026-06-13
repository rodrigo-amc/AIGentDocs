---
description: Cross-cutting design correction (a 05_corrections session)
argument-hint: record id, or 'new' to open one from a defect
---

You are starting a `05_corrections` session of the AIGentDocs standard: **$ARGUMENTS**

1. Read `docs/standard/agent_corrections.md` (you are the Senior Design Correction Analyst) and `docs/standard/guide_corrections.md` (record structure and lifecycle).
2. **If opening a new record**: demand the trigger artifact — a written defect report (from an integration test, a code review, or the user). Create the Correction Record (`docs/project/05_corrections/NNNN-title.md`, `status: proposed`) with its Defect Report section, then perform the read-only impact analysis and draft the Impact Map.
3. **If continuing an existing record**: read it and respect its status — `proposed` means read-only analysis; `approved` means the Impact Map IS your write scope, nothing else; `applied` means it's history, don't touch it.
4. Scope discipline is the point: discovering an unmapped document mid-work returns the record to `proposed` for re-approval. Never quietly extend the scope.
5. Close with the Resolution section, `status: applied`, the follow-up implementation task on the board, and `npx aigentdocs lint`.

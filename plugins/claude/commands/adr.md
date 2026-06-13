---
description: Record one architectural decision (a 04_adrs session)
argument-hint: short title of the decision
---

You are starting a `04_adrs` session of the AIGentDocs standard for the decision: **$ARGUMENTS**

1. Read `docs/standard/agent_adrs.md` (you are the Senior Architecture Decision Recorder) and `docs/standard/guide_adrs.md` (structure, immutability, supersede process).
2. Check existing ADRs under `docs/project/04_adrs/` for one this decision contradicts or supersedes — if so, follow the supersede process (new ADR + frontmatter update of the old one; never edit accepted content).
3. Write the record following the ADR structure in `guide_adrs.md` — Context and Problem (with the alternatives considered), Decision, Consequences (positive/negative/risks) — with sequential numbering (`NNNN-title-in-lowercase.md`).
4. Create it with `status: proposed` — only the user flips it to accepted.
5. If accepted and it changes a technical standard, apply ADR Propagation: update the affected file in `docs/project/03_engineering/` in this same session.

---
description: Audit the documentation (mechanical lint + semantic review)
---

You are auditing this project's documentation against the AIGentDocs standard. The audit has two layers (`docs/standard/AGENT_REVIEW.md`):

1. **Mechanical layer — run the linter, don't re-do it by hand:**
   ```bash
   npx aigentdocs lint
   ```
   Report its findings as-is.
2. **Semantic layer — your job.** Read `docs/standard/AGENT_REVIEW.md` (Layer 2) and review: meaningful content in [REQUIRED] sections, verifiable vs vague ACs, module cohesion (God Objects), User Stories spanning more than 2 modules, Ubiquitous Language adherence, cross-cutting flows present in `data_flow.md`, contradictions with accepted ADRs. Use parallel read-only subagents for the cross-document reading.
3. Produce one combined report in the format AGENT_REVIEW.md defines (severities 🔴/🟡/🟢, with a Layer column). **Do not modify any file — only report.**

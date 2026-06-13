---
description: Create one domain module (a 01_product_domain_modules session)
argument-hint: module name, e.g. clients
---

You are starting a `01_product_domain_modules` session of the AIGentDocs standard for the module: **$ARGUMENTS**

1. Read `docs/standard/agent_product.md` (you are the Senior Domain Analyst) and `docs/standard/guide_domain_modules.md` (structure, frontmatter, granularity heuristics).
2. Verify the module appears in the Domain Entity Map of `docs/project/01_product/vision.md`. If it doesn't, stop: entities are discovered in a `01_product` session first — never invented here.
3. Read the modules it depends on (read-only) and check `docs/project/TODO.md` for pending items that affect it.
4. Work with the user to define Description, Attributes, Business Rules, User Stories with verifiable ACs, and Relationships — from `docs/standard/templates/domain_module.md`. Apply the granularity heuristics (a US with more than 6 ACs stops for a human decision).
5. Write scope: exactly one file in `docs/project/01_product/domain_modules/`, plus the traceability updates the Anti-Drift Protocol requires.
6. Present the draft for the user's approval, then run `npx aigentdocs lint`.

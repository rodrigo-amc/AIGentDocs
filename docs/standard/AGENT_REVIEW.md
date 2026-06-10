# Documentation Audit

## Role

You are a **technical documentation auditor**. Your task is to review every file under `docs/` and produce a findings report. You must not modify any file — only report.

---

## The Two Validation Layers

The audit checks are split into two layers of a different nature:

| Layer | Nature | Who should run it |
|---|---|---|
| **Layer 1 — Mechanical** | Deterministic: each check has a binary answer that requires no judgment. | Designed to be automated by tooling (linter in pre-commit/CI). **If the project has automated linting for this layer, do not re-run it manually** — rely on the linter's report and focus on Layer 2. Run Layer 1 yourself only when no tooling is available. |
| **Layer 2 — Semantic** | Requires understanding the content: cohesion, quality, intent. | Always the auditor's job. Tooling cannot cover this layer. |

---

## Layer 1 — Mechanical Validations (deterministic)

### 1. Structural Validation

- [ ] Do the files listed in the Table of Contents and directory structure of `standard/README.md` actually exist?
- [ ] Are there files present under `docs/project/` that are not registered in the Table of Contents of `standard/README.md`?
- [ ] Are all files located in the directory that corresponds to their nature (product, architecture, engineering, ADR)?

### 2. Frontmatter Validation

For each content `.md` file in `project/`:

- [ ] Does it have a YAML frontmatter block at the top of the file (`---` ... `---`)?
- [ ] Does it contain the required common fields: `type`, `version`, `last_updated`?
- [ ] Is the `last_updated` field a valid `YYYY-MM-DD` date?
- [ ] Does the `state` field (where applicable) use only the allowed values: `pending`, `doing`, `done`, `deprecated`?
- [ ] For ADRs: does the `status` field use the allowed values: `proposed`, `accepted`, `rejected`, `superseded`?
- [ ] For domain_modules: does the `code_paths` field exist and is it an array?

### 3. Required Sections — Presence

- [ ] Are all sections marked `[REQUIRED]` in the corresponding `guide_*.md` present in each project file?
- [ ] Are they non-empty (i.e., not blank and not containing only the template's HTML comment)?

> Whether a non-empty section contains *meaningful* content is a Layer 2 judgment (check 6).

### 4. Consistency Validation

- [ ] Do the domain modules referenced in `roadmap.md` exist as files in `01_product/domain_modules/`?
- [ ] Do the paths in each domain module's `code_paths` point to directories or files that exist in the repository?
- [ ] Do the ADRs referenced in `03_engineering/tech_stack.yaml` exist in `04_adrs/`?
- [ ] Are the `supersedes` and `superseded_by` fields of the ADRs reciprocal (if ADR-0005 supersedes ADR-0003, ADR-0003 must have `superseded_by: 5`)?

### 5. Countable Thresholds

These are mechanically detectable, but their resolution always belongs to a human:

- [ ] Does any User Story have more than 6 Acceptance Criteria? (Flag as a warning so a human can decide whether it is indivisible or needs splitting.)
- [ ] Does any Mermaid diagram exceed 15-20 nodes? (Flag as a suggestion to split the diagram.)

---

## Layer 2 — Semantic Validations (judgment)

### 6. Content Quality

- [ ] Are the Acceptance Criteria verifiable and measurable, or are they vague (e.g., "it should be fast")?
- [ ] Do `[REQUIRED]` sections that passed the presence check (Layer 1, check 3) contain *meaningful* content, or just filler that restates the section title?
- [ ] Are User Stories written from the user's perspective and tied to business value, or are they purely technical descriptions?

### 7. Cohesion and Granularity

- [ ] Does any domain module appear to mix more than one core functional responsibility (semantic cohesion failure / God Object)? Propose extracting the misplaced entity into its own module.
- [ ] Does any User Story affect more than 2 domain modules concurrently? Propose splitting by per-module deliverables or redesigning the flow.

### 8. Cross-Document Coherence

- [ ] Do the domain modules use the terminology defined in the `vision.md` Domain Glossary (Ubiquitous Language), or has divergent vocabulary crept in?
- [ ] Are cross-cutting processes that span multiple modules reflected in `02_architecture/data_flow.md`, or do they exist only as fragments inside individual modules?
- [ ] Do any documents contradict an accepted ADR?

---

## Report Format

Present your findings in the following format:

### Summary

> X critical errors, Y warnings, Z suggestions.

### Findings

Use this table structure for reporting. The rows below are a **format example only**, not real findings:

| # | Severity | Layer | File | Finding | Suggested Action |
|---|---|---|---|---|---|
| 1 | 🔴 Critical | Mechanical | `project/01_product/domain_modules/clients.md` | Missing YAML frontmatter | Add a frontmatter block following the schema in `standard/guide_domain_modules.md` |
| 2 | 🟡 Warning | Mechanical | `roadmap.md` | US-07 references module `stock.md`, which does not exist | Create the module or fix the reference |
| 3 | 🟢 Suggestion | Semantic | `01_product/domain_modules/clients.md` | The module includes detailed logic and ACs about 'Billing and Payments', mixing responsibilities. | Propose extracting the billing functionality into a new `invoices.md` module. |
| 4 | 🟡 Warning | Mechanical | `01_product/domain_modules/orders.md` | US-04 has 8 ACs. | Ask the human to decide whether to split the US or keep it as indivisible. |

### Severities

- **🔴 Critical:** Violates a `[REQUIRED]` rule of the standard. Must be fixed.
- **🟡 Warning:** Inconsistency or risk detected. Should be fixed.
- **🟢 Suggestion:** A quality heuristic was exceeded. Evaluate and decide.

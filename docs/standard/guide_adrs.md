---
type: standard_guide
scope: adrs
version: 1.4
last_updated: 2026-06-10
project_path: "project/04_adrs/"
required_files: []
optional_files: []
---

# 04_adrs — Architecture Decision Records

This directory contains the immutable record of the project's significant architectural decisions. It follows the industry standard (AWS/Google) of explaining the **Context**, the **Decision** made, and its **Consequences**.

ADRs prevent past decisions from being re-litigated and explain the "why" behind the project's evolution.

---

## Usage Rules

1. The **content (Markdown)** of ADRs is immutable: once accepted or rejected, they are not modified.
2. The **frontmatter (YAML)** of an ADR **may be updated**, exclusively to reflect status changes (`status: superseded`) and traceability (`superseded_by: [ID]`).
3. To change a decision, a **new ADR** is created that references the previous one in its context, and the old ADR's frontmatter is updated.
4. Numbering is **sequential**: 0001, 0002, 0003...
5. Every ADR with **Accepted** status that modifies a technical standard **must** be reflected by updating the corresponding file in `project/03_engineering/`.

---

## How to create a new ADR

1. Create a new `.md` file in this directory using the naming format: `NNNN-title-in-lowercase.md` (e.g., `0002-use-postgresql-as-database.md`).
2. Write the content following the structure defined in the **"Structure of an ADR"** section of this document.
3. Complete every **[REQUIRED]** section.
4. Set the status to `proposed` until it is reviewed and approved.
5. Update the Table of Contents in `standard/README.md`.

## How to record the replacement of a decision

1. Create a new ADR following the steps above.
2. In the new ADR, reference the ADR being replaced in the Context section and in the `supersedes` frontmatter field.
3. Open the old ADR and **update its frontmatter**: set `status: superseded` and fill in `superseded_by: [ID of the new ADR]`.
4. **Under no circumstances modify the content (Markdown)** of the original ADR.
5. If the decision affects a technical standard, update the corresponding file in `project/03_engineering/`.

---

## Structure of an ADR

Every ADR file must contain the following sections, in this order:

### Frontmatter

```yaml
---
type: adr
id: 0                    # Sequential ADR number
version: 1.0
last_updated: YYYY-MM-DD
status: proposed         # proposed | accepted | rejected | superseded
date: YYYY-MM-DD         # Date of the decision
decision_makers: []      # List of decision makers (e.g., [Juan, María])
supersedes: null         # ID of the ADR it replaces (if applicable)
superseded_by: null      # ID of the ADR that replaced it (if applicable)
---
```

### Header

```markdown
# [NNNN] - [Short Title in Present Tense]
```

### ADR Sections

| Section | Type | Description |
|---|---|---|
| Context and Problem | **[REQUIRED]** | What problem, constraint, or need forces a decision. Include the alternatives considered. |
| Decision | **[REQUIRED]** | What was decided and why. Be technologically specific. |
| Consequences | **[REQUIRED]** | Positive, negative, and risks arising from the decision. |
| Compliance | **[OPTIONAL]** | How adherence to the decision is verified (e.g., automated tests, code review, linter rules). |

### Consequences Format

Consequences must be organized into three categories:

```markdown
## Consequences

### Positive
- [positive consequence]

### Negative
- [negative consequence]

### Risks
- [identified risk]
```

---

## Initial ADR: `0001-record-architecture-decisions.md`

This is the first ADR of every project. It documents the decision to adopt ADRs. Its baseline content is:

- **Context:** "We need a formal mechanism to record significant architectural decisions and their rationale, so that any team member (human or AI agent) can understand the project's evolution."
- **Decision:** "We will use Architecture Decision Records (ADRs) stored in `project/04_adrs/`, following the structure defined in `guide_adrs.md`."
- **Consequences:** "All architectural decisions will be traceable. Discipline is required to create an ADR for every significant decision."

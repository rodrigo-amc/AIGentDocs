---
type: standard_guide
scope: corrections
version: 1.4
last_updated: 2026-06-10
project_path: "project/05_corrections/"
required_files: []
optional_files: []
---

# 05_corrections — Design Correction Records

This directory contains one record per **cross-cutting design correction**: a defect discovered late (typically during implementation or integration testing) that is not a code bug but a flaw in the documented design, and whose fix spans documents owned by different sessions.

A Correction Record solves the governance problem these fixes create: editing multiple documents across sessions would violate the Session Guard Rule. The record makes the exception **explicit, bounded, and auditable** — its approved Impact Map *is* the write scope of the correction session.

---

## Usage Rules

1. **A correction starts from a defect report, never from a verbal instruction.** The reporter may be an agent (`agent_integration_tester.md`, `agent_code_reviewer.md`) or a human, but the defect must be written into the record before any analysis begins.
2. **Status lifecycle:** `proposed` (defect recorded, impact under analysis) → `approved` (the human approved the Impact Map) → `applied` (all corrections executed). A record may also end `rejected`.
3. **Once approved, the Impact Map is frozen** — it defines exactly which documents may be modified. If during execution you discover the scope was wrong, the record returns to `proposed`, the map is amended, and it must be re-approved.
4. **If the correction reverses an accepted ADR**, the Impact Map must include the supersede process of `guide_adrs.md` (new ADR + frontmatter update of the old one).
5. Numbering is **sequential**: 0001, 0002, 0003... File naming: `NNNN-title-in-lowercase.md`.
6. Applied records are not deleted — they are the audit trail of how the design evolved under pressure from reality.

---

## Structure of a Correction Record

### Frontmatter

```yaml
---
type: correction
id: 0                      # Sequential number
version: 1.0
last_updated: YYYY-MM-DD
status: proposed           # proposed | approved | applied | rejected
reported_by: ""            # integration_tester | code_reviewer | human | other
affected_modules: []       # Domain modules involved (e.g., [orders, clients])
---
```

### Sections

| Section | Type | Description |
|---|---|---|
| Defect Report | **[REQUIRED]** | Observed behavior, expected behavior according to the current documentation, and why this is a **design flaw** rather than an implementation bug. Immutable once the record is approved. |
| Impact Map | **[REQUIRED]** | Table of every artifact the correction touches: document → section/US/AC/diagram → proposed change. This is the write scope once approved. |
| Resolution | **[REQUIRED once applied]** | What was changed, links to the corrected documents' new versions, and the follow-up implementation task on the board. |

### Impact Map format

```markdown
| Document | Element | Proposed change |
|---|---|---|
| `01_product/domain_modules/orders.md` | US-04, AC-03 | Rewrite: confirmation must also reserve stock |
| `02_architecture/data_flow.md` | "Order confirmation" sequence diagram | Add reservation step |
| `04_adrs/0008-....md` | — | Supersede with new ADR (synchronous → event-driven) |
```

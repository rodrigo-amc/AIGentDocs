---
type: adr
id: 6
version: 1.0
last_updated: 2026-06-12
status: accepted
date: 2026-06-12
decision_makers: [rodrigo-amc]
supersedes: null
superseded_by: null
---

# 0006 - Project Content Lives Outside the Standard Copy

## Context and Problem

`docs/standard/` is the standard itself — a copy that `aigentdocs update` replaces to keep an adopter current. But the original design also asked adopters to write project-specific content *into* `docs/standard/README.md`: the project's name (replacing the file's title) and its conventions (documentation language, adoption profile, date format). Those two ideas are incompatible:

- If `docs/standard/` is a replaceable copy of the product, nothing project-specific can live there.
- If project-specific content lives there, `update` cannot replace it without losing data.

The conflict surfaced concretely while reviewing the docs: `update` carried a workaround (preserve a customized `README.md`, write the incoming one as `README.md.new` for manual merge) that was a band-aid over this design flaw, and the prospect of `update` overwriting an adopter's project name/conventions was a real risk. One reaction considered was removing `update` entirely.

## Decision

Keep `update`, and remove the conflict at its root: **`docs/standard/` carries nothing project-specific and is replaced wholesale on update.** Project-specific content moves to files the update never touches, in the adopting repository's root:

- **Project identity** (name, description, the front page humans and agents first read) → the repository's own root `README.md`.
- **Project conventions** (documentation language, adoption profile, date format, writing style) → the root `AGENTS.md`, which gains a "Project conventions" section in its template.

`docs/standard/README.md` becomes the standard's specification only, self-contained. `update` simply replaces `docs/standard/`; the `README.md.new` merge workaround is removed.

## Consequences

### Positive
- `update` becomes trustworthy and simple — a wholesale replace, no merge step, no risk to project data.
- The standard README's long-standing double identity (spec + project front page) is eliminated.
- `AGENTS.md` (already the agent entry point) becomes the single home for conventions — which is what this repository already does for itself.

### Negative
- A one-time relocation for any existing adopter that had recorded conventions in `docs/standard/README.md`: move them to `AGENTS.md`.

### Risks
- Low. The AGENTS.md template and Lite Mode were updated so new adopters land in the right place; the standard's changelog (1.4.6) records the migration.

## Compliance

`core/update.ts` replaces `docs/standard/` wholesale with no preservation logic; its tests assert that local edits to `docs/standard/` do not survive an update and that no `README.md.new` is produced.

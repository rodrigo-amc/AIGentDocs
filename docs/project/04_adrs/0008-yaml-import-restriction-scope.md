---
type: adr
id: 8
version: 1.0
last_updated: 2026-07-04
status: accepted
date: 2026-07-04
decision_makers: [rodrigo-amc]
supersedes: null
superseded_by: null
---

# 0008 - Scope the `yaml` Import Restriction to Published Packages

## Context and Problem

ADR-0003 adopted the `yaml` package and added a Compliance clause: "only `@aigentdocs/core` may import `yaml` (CLI and future MCP go through core)". Its purpose, per that ADR's Risks section, is to keep the parser replaceable behind core's `frontmatter.ts` wrapper — a property that matters for the published tooling, which parses arbitrary YAML from adopters' documents.

The 2026-07-04 scaffold code review (finding 2) found that `scripts/check-standard-version.mjs` — the release guard that verifies a `standard-v*` tag matches `changelog.yaml` and `packages/standard/package.json` — imports `yaml` directly, against the letter of the clause. Worse, the import only resolves through npm hoisting: the root `package.json` does not declare `yaml`, so the script borrows the copy npm hoists from core's dependency. If core ever swapped parsers, or npm changed its hoisting layout, the release guard would break with no change to the script itself.

The clause never said whether it covers repository build/release scripts, so the decision must be made explicit. Alternatives considered:

- **Apply the clause literally: the script consumes core's `parseYaml` wrapper** — keeps a single `yaml` import site, but couples a release guard that parses our own `changelog.yaml` to the TypeScript build: after `npm run clean`, `node scripts/check-standard-version.mjs` fails confusingly because `@aigentdocs/core`'s `dist/` does not exist. Disproportionate coupling for reading one version field from a file we own.
- **Remove the parse: extract the version with a regex** — eliminates the import question, but it is the hand-rolled-subset-parser anti-pattern ADR-0003 explicitly rejected; it breaks silently if the changelog's quoting or ordering shifts.
- **Scope the clause to published packages and make the script's dependency explicit** — matches the clause's original intent; the hoisting fragility disappears because the root declares its own dependency.

## Decision

ADR-0003's Compliance clause applies to the **published packages** of this monorepo (`@aigentdocs/core`, the `aigentdocs` CLI, `@aigentdocs/mcp`, and any future published package): among them, only core may import `yaml`, and everything else consumes YAML parsing through core's wrapper.

Repository build and release scripts (`scripts/*.mjs`) are outside the clause: they may import `yaml` directly, **provided the root `package.json` declares it as a devDependency** — no import may rely on npm hoisting. The declared range must stay semver-compatible with core's (`^2.9.0` today) so npm dedupes to a single installed copy.

This ADR complements ADR-0003; it does not supersede it. The chained fix declares `yaml` as a root devDependency, legitimizing the existing import in `scripts/check-standard-version.mjs`.

## Consequences

### Positive

- The release guard runs standalone (`node scripts/check-standard-version.mjs`) with no TypeScript build step, as a pre-build check should.
- The hoisting fragility is gone: the script's dependency is explicit, version-managed, and survives a future parser swap inside core.
- The intent of ADR-0003's clause is now written down; the letter-vs-intent ambiguity cannot be re-litigated.

### Negative

- `yaml` now has two declared consumers (core's runtime dependency and the root devDependency), so core's `frontmatter.ts` is no longer the only import site in the repository — the wrapper guarantee now holds for published code only.

### Risks

- A future script author could read this as a license to bypass core's wrapper in package code — mitigated: the clause's package-side restriction is restated here and remains verifiable by inspection.
- The root devDependency range could drift from core's and npm would install two copies — mitigated: both currently declare `^2.9.0`, and the Compliance check below covers it.

## Compliance

Verifiable by inspection: `grep` for `yaml` imports — the only matches allowed are `packages/core/src/frontmatter.ts` and files under `scripts/`; the root `package.json` must declare `yaml` in `devDependencies` with a range semver-compatible with core's.

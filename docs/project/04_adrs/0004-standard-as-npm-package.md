---
type: adr
id: 4
version: 1.0
last_updated: 2026-06-11
status: accepted
date: 2026-06-11
decision_makers: [rodrigo-amc]
supersedes: null
superseded_by: null
---

# 0004 - Ship the Standard as Its Own npm Package

## Context and Problem

`aigentdocs init` must copy `docs/standard/` into the adopter's repository, so the published CLI needs the standard's files at runtime. npm only packs files inside a package's own directory, but the standard's source of truth must remain at `docs/standard/` — it is the product, browsed on GitHub, and this repo's own `AGENTS.md` points there.

Alternatives considered:

- **Copy the standard into the CLI package at build time** — works, but couples the standard's release cycle to the CLI's and gives the `update` command (T-11) nothing to version against.
- **Publish the standard as its own package, `@aigentdocs/standard`** — a build step syncs `docs/standard/` → `packages/standard/standard/` (gitignored); the package's version mirrors the standard's `changelog.yaml`; the CLI depends on it and resolves the files through Node's module resolution.
- **Read `../../docs/standard` relative to the CLI** — only works inside this monorepo, breaks when installed from npm.

## Decision

Publish `@aigentdocs/standard`: a code-less npm package whose contents are synced from `docs/standard/` at build time and whose version mirrors the top entry of `changelog.yaml` (enforced by a test). The CLI declares it as a dependency and locates the files via `require.resolve`.

## Consequences

### Positive
- The standard gets independent versioning on npm — the natural foundation for `aigentdocs update` and the `standard_version` field (T-11).
- The source of truth stays at `docs/standard/`; the package is a build artifact.
- CLI releases and standard releases can move at different cadences.

### Negative
- One more package to publish, and a build-time sync step.

### Risks
- The synced copy could drift from `docs/standard/` if the sync step is skipped — mitigated: the sync runs inside the root `build` script, and a test asserts the package version matches `changelog.yaml`.

## Compliance

`npm run build` always re-syncs; the version-mirror test fails CI when `changelog.yaml` and the package version diverge.

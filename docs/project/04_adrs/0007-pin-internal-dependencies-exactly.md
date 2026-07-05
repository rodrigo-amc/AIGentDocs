---
type: adr
id: 7
version: 1.0
last_updated: 2026-07-04
status: accepted
date: 2026-07-04
decision_makers: [rodrigo-amc]
supersedes: null
superseded_by: null
---

# 0007 - Pin Internal Monorepo Dependencies Exactly

## Context and Problem

ADR-0004 ships the standard as its own npm package (`@aigentdocs/standard`) and has the CLI declare it as a dependency, but it never specified the version-range semantics of that declaration. The result is inconsistent and undocumented (finding 1 of the 2026-07-04 scaffold code review): `packages/cli/package.json` pins `@aigentdocs/core` exactly (`0.1.2`) but declares `@aigentdocs/standard` with a caret (`^1.5.0`), while `@aigentdocs/mcp` pins core exactly.

The caret breaks two properties the tooling's design depends on:

- **Tested combinations.** Internal packages are released in lockstep from the monorepo (T-14, T-17), and the version-mirror test (`packages/cli/test/init.test.ts`) only runs inside it — so the only CLI+standard combination ever tested is the one that exists at release time. A published CLI whose caret later resolves a newer standard minor scaffolds content it was never tested against. This is not hypothetical: standard 1.5.0 (a minor, T-17) renamed `AGENT.md` to `PROTOCOL.md` and required coordinated changes in the CLI/MCP generated output — an already-published CLI with `^1.4.3` resolving 1.5.0 would have scaffolded `PROTOCOL.md` while its own code still referenced `AGENT.md`.
- **The `update` contract (T-11).** `aigentdocs update` upgrades the adopter's `docs/standard/` to "this CLI's bundled version", and the `ahead` state answers "upgrade the CLI instead". Both assume the bundled standard version is a function of the CLI version. With a caret, a plain `npm update` can change the standard a given CLI bundles without any CLI change, and the `ahead` advice guarantees nothing.

Alternatives considered:

- **Caret for all internal dependencies** — fewer CLI releases when the standard changes, but it extends the untested-combination problem to core and makes the same CLI version scaffold different content over time (no reproducibility).
- **Mixed policy: exact for code packages, caret for the standard ("it's only content")** — untenable: core/cli lint rules are coupled to the standard's content (heading catalogs, required sections, session names), and T-17 proves a content minor can require coordinated tooling changes.
- **Exact pin for all internal dependencies** — every published package resolves exactly the combination built and tested together; matches the de facto lockstep release flow.

## Decision

Every internal `@aigentdocs/*` dependency declared by a published package of this monorepo (the `aigentdocs` CLI, `@aigentdocs/mcp`, and any future package) is pinned to an **exact version** — no caret, tilde, or range. Internal packages are released in lockstep from the monorepo, so every published combination is exactly the one built and tested together.

A new standard release therefore reaches CLI users through a CLI patch release that bumps the pinned `@aigentdocs/standard` version. Standard-only consumption without the CLI remains available via the per-version bundle (T-10).

## Consequences

### Positive

- A published CLI or MCP version always resolves the exact internal-package versions it was tested with; installs are reproducible over time.
- The T-11 `update` contract holds: the CLI version determines the bundled standard version, so "ahead → upgrade the CLI" is always correct advice.
- The policy is uniform — no per-dependency judgment calls about whether a package is "just content".

### Negative

- Every standard release requires a CLI patch release to distribute it (already the de facto lockstep flow).
- Adopters cannot receive standard updates through `npm update` alone; they must bump the CLI (this is the intent).

### Risks

- A release that bumps the standard but forgets to bump the CLI's pin would publish a CLI still bundling the old standard — mitigated by the lockstep release flow and the version-mirror test, which fails in the monorepo when the resolved standard package and `changelog.yaml` diverge.

## Compliance

Verifiable by inspection: `dependencies` entries for `@aigentdocs/*` in `packages/*/package.json` must be exact versions. The version-mirror test (`packages/cli/test/init.test.ts`) and the lockstep release checklist enforce that the pinned versions are the ones published together.

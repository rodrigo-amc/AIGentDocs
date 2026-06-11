---
type: adr
id: 3
version: 1.0
last_updated: 2026-06-11
status: proposed
date: 2026-06-11
decision_makers: [rodrigo-amc]
supersedes: null
superseded_by: null
---

# 0003 - Use the `yaml` npm Package for YAML Parsing

## Context and Problem

The `lint` command must parse YAML in two places: the frontmatter of every content markdown document, and full YAML files (`tech_stack.yaml`, `project_status.yaml`). Node's standard library has no YAML parser. Our constraint says runtime dependencies must be minimal and each one needs an ADR.

Alternatives considered:

- **`yaml` package** (~"eemeli/yaml") — pure JavaScript, zero transitive dependencies, actively maintained, YAML 1.2 core schema by default (ISO dates stay strings, which suits our `last_updated` validation).
- **`js-yaml`** — also popular, but YAML 1.1 by default (parses bare dates into `Date` objects, complicating validation) and its type-safety story is weaker.
- **Hand-rolled subset parser** — avoids the dependency, but frontmatter in real adopter projects is arbitrary YAML (nested maps in `project_status.yaml`, multiline arrays); a homegrown parser would grow into an unmaintained YAML implementation — the classic mistake.

## Decision

Add `yaml` (^2) as the single runtime dependency of `@aigenticdocs/core`, parsing with the default YAML 1.2 core schema.

## Consequences

### Positive
- Correct YAML handling for any adopter's documents, not just our templates.
- Zero transitive dependencies keeps the supply-chain surface minimal.

### Negative
- First runtime dependency of the tooling (was zero).

### Risks
- Upstream abandonment — mitigated: the package is small, stable, and replaceable behind our `frontmatter.ts` wrapper, the only module that imports it.

## Compliance

`package-lock.json` pins it; only `@aigenticdocs/core` may import `yaml` (CLI and future MCP go through core).

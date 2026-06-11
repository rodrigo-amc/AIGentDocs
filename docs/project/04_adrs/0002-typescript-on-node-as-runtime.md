---
type: adr
id: 2
version: 1.0
last_updated: 2026-06-11
status: accepted
date: 2026-06-11
decision_makers: [rodrigo-amc]
supersedes: null
superseded_by: null
---

# 0002 - TypeScript on Node.js as the Tooling Runtime

## Context and Problem

The `aigenticdocs` CLI (Phase 2) and the MCP server (Phase 3) need a language and runtime. Requirements: frictionless execution for adopters (`npx aigenticdocs init` with no prior install), a single codebase shared between CLI and MCP server, strong typing for the lint rule engine, and a healthy ecosystem for YAML/markdown parsing.

Alternatives considered:

- **TypeScript on Node.js** — runs via `npx` with zero install; the official MCP SDK is TypeScript-first; same code serves CLI and server; the team and target audience (users of AI coding tools) live in the npm ecosystem.
- **Go** — single static binary, no runtime dependency, excellent CLI ergonomics; but distribution via npm requires binary-wrapping tricks, and the MCP server would need a second codebase or a less mature SDK.
- **Python** — good parsing libraries, but distribution (`pipx`/venvs) adds more friction than `npx` for this audience, and packaging the standard as an asset is less ergonomic.

## Decision

TypeScript (5.x, strict mode) on Node.js (>=20 LTS), distributed through npm and executed with `npx`. npm workspaces organize the monorepo: `packages/core` (frontmatter/markdown parsing, lint rules), `packages/cli` (commands), and later `packages/mcp` (server reusing core).

## Consequences

### Positive
- Zero-install adoption path (`npx aigenticdocs init`).
- One typed codebase for CLI and MCP server; lint rules written once.
- Direct reuse of the TypeScript-first MCP SDK in Phase 3.

### Negative
- Requires Node.js >=20 on the adopter's machine (mitigated: the no-CLI tarball path needs nothing).
- Slower cold start than a compiled binary (irrelevant at this tool's scale).

### Risks
- Dependency creep from the npm ecosystem — mitigated by the `tech_stack.yaml` constraint: every runtime dependency requires an ADR.

## Compliance

`tech_stack.yaml` lists the exact versions; CI runs on the pinned Node LTS; `lint` itself has no network access and no LLM calls.

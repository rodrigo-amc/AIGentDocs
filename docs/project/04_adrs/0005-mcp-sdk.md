---
type: adr
id: 5
version: 1.0
last_updated: 2026-06-12
status: accepted
date: 2026-06-12
decision_makers: [rodrigo-amc]
supersedes: null
superseded_by: null
---

# 0005 - Official MCP SDK for the Multi-Agent Server

## Context and Problem

Phase 3 exposes the standard's operations as tools that any MCP-capable agent can call (Claude Code, Codex, Antigravity, Copilot, JetBrains). Implementing the Model Context Protocol means JSON-RPC over stdio, capability negotiation, and schema declaration — a protocol surface we should not hand-roll.

Alternatives considered:

- **`@modelcontextprotocol/sdk`** (official TypeScript SDK, v1.29) — maintained by the protocol's authors, tracks spec revisions, ships server + client + an in-memory transport that makes end-to-end testing trivial. Brings `zod` for tool input schemas and its own transitive dependencies.
- **Hand-rolled JSON-RPC over stdio** — keeps dependencies at zero but re-implements a moving spec; every protocol revision becomes our maintenance burden.
- **Community frameworks (FastMCP et al.)** — thinner ergonomics over the same SDK; adds a layer without removing the dependency.

## Decision

Add `@modelcontextprotocol/sdk` (^1.29) and `zod` (^3) as dependencies of a new `@aigentdocs/mcp` package. The server reuses `@aigentdocs/core` for all domain logic — the MCP layer only declares tools and serializes results.

## Consequences

### Positive
- Protocol compliance maintained upstream by the spec's authors.
- One server serves every MCP-capable agent (the whole point of Layer 3).
- In-memory client/server pair enables real end-to-end tests without spawning processes.

### Negative
- First heavyweight dependency subtree of the project (the CLI stays at one dependency — `yaml` — because the MCP server is a separate package).

### Risks
- SDK churn while MCP evolves — mitigated: pinned major, and all domain logic lives in core, so the SDK surface we touch is small.

## Compliance

Only `packages/mcp` may depend on the SDK; `packages/core` and `packages/cli` remain unaffected (`npm ls` shows the isolation).

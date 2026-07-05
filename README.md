# AIGentDocs

> Docs as Code for AI-augmented software engineering: living documentation that agents design, build from, and keep in sync with the code.

AIGentDocs is a **framework** for AI-augmented software engineering, built on a **docs-as-code standard** and the tooling that makes it enforceable. It treats a project's documentation the way you treat source code — versioned in the repo, reviewed in pull requests, validated in CI — so it becomes a **living, trustworthy source of truth** that AI coding agents can rely on to understand a project, design it, and implement it.

> **AI agent reading this repository?** Start at [`AGENTS.md`](AGENTS.md) — the entry point that leads to the operating rules in `docs/standard/PROTOCOL.md`.

## The idea: documentation as code

An AI agent is only as good as the context it's given, and context that isn't versioned or enforced drifts from reality — a stale spec is worse than none. AIGentDocs' foundational bet is to make documentation a first-class, code-grade artifact:

- **Permanent, not per-feature** — the documentation is the durable state of the whole project, maintained as part of the development flow; not disposable specs written for one feature that age out once it ships.
- **Durable and structured** — four layers (product, architecture, engineering, decisions) with reading protocols that load only the context a task needs.
- **Discovered, not dumped** — Domain-Driven Design (Knowledge Crunching) draws the domain out in dialogue with you; a human approves every document.
- **Enforced, not promised** — a deterministic linter checks structure, consistency, and completeness on every commit and PR. You lint the docs the way you lint the code.

Everything else in the project orbits this single idea: some pieces **produce and protect** the living documentation, others **consume** it to build the software.

## What it covers — design to implementation

The documentation isn't an afterthought to the code; it's the source the code is built from. AIGentDocs spans the whole lifecycle with a cast of role-specialized **agent profiles**:

**Design — agents that _produce_ the documentation**
- **Product**, via DDD — vision, domain modules, roadmap (the "why").
- **Architecture** — C4 diagrams, data flows, infrastructure (the "what").
- **Engineering** — tech stack, testing strategy, API guidelines (the "how").
- **Decisions** — Architecture Decision Records (ADRs): immutable and traceable.

**Implementation — agents that _consume_ the documentation**
- **scaffold** — bootstraps the project structure from the approved docs.
- **module-developer** — builds a domain module (code + tests) exactly as specified.
- **code-reviewer** — checks the code against the docs, not against vibes.
- **integration-tester** — turns acceptance criteria into tests against the running system.

In both phases the contract is the same: **the agent proposes, a human approves; the documentation is the source of truth, and when code and docs disagree, the code is what's wrong.**

## How it's organized

Work happens in **sessions** with bounded write scopes — one area, one document at a time. The **Anti-Drift Protocol** ties every code change to the documentation it must update, in the same change. When reality proves a design wrong, a **Correction Record** fixes the documentation first — with an approved impact map as the audit trail — and the code follows. Four layers under `docs/project/`:

| Layer | Question it answers |
|---|---|
| Product (`01_product/`) | Why does this exist? What does it do? |
| Architecture (`02_architecture/`) | What was built? How does it connect? |
| Engineering (`03_engineering/`) | What technical rules apply? |
| Decisions (`04_adrs/`) | Why were these choices made? |

## The tooling

The standard is plain markdown and works on its own; the tooling is what makes "docs as code" enforceable and portable across every agent:

- **CLI** (`aigentdocs` / `agd`, on npm): `init` scaffolds, `lint` validates (deterministic, no LLM), `adapt` generates per-tool entry files, `update` keeps the standard current. Install it as a dev dependency (`npm i -D aigentdocs`) for the `agd` alias, the pre-commit hook, and CI.
- **Enforcement** — a pre-commit hook and a reusable GitHub Action run `lint`; only critical findings block, and the bypass is always a conscious choice.
- **MCP server** (`@aigentdocs/mcp`) — exposes the standard's operations as tools for any MCP-capable agent.
- **Claude Code plugin** — the session protocols as commands, the agent profiles as subagents.

## Quick start

```bash
npx aigentdocs init     # scaffold docs/ + the AGENTS.md entry point
```

`init` is additive: a repository with an existing `docs/` folder can adopt as-is — it refuses to run only if `docs/standard/` or `docs/project/` already exist (a prior adoption), and it never deletes or overwrites your other `docs/` content.

Prefer no tooling at all? Every release of the standard also ships as a downloadable bundle (tar.gz/zip with `docs/standard/` and the `AGENTS.md` entry point already assembled) on [GitHub Releases](../../releases) — or just copy `docs/standard/` into your repo by hand. The CLI is the convenient path, not the only one.

Then open the repo with your AI agent and point it at `docs/standard/PROTOCOL.md`: for a new project it drafts `vision.md` with you (design first); for existing code it reverse-engineers the docs (onboarding). The agent drafts, you approve.

The full workflow, commands, and operating rules live in **`docs/standard/PROTOCOL.md`** and the area guides (`docs/standard/guide_*.md`).

## Tool compatibility

Tool-agnosticism is a foundational requirement, solved with an architecture of adaptation layers where **each layer works without the next**:

```text
Layer 0 — Core:        docs/standard/ (plain markdown)  → works with ANY agent, IDE, or LLM
Layer 1 — Entry:       AGENTS.md at the repo root       → read natively by 30+ AI coding tools
Layer 2 — Enforcement: lint + pre-commit + CI           → git and CI don't depend on the agent
Layer 3 — Tooling:     MCP server                       → one implementation, every MCP-capable agent
Layer 4 — Adapters:    per-tool files from `adapt`      → CLAUDE.md, .cursor/rules, ...
                       + native plugins (Claude Code)
```

A project can adopt Layers 0-1 alone — plain markdown plus an entry file — and already operate from any tool, with nothing installed. The critical enforcement lives in the agnostic layers: native agent hooks are an experience upgrade, never the only line of defense. `AGENTS.md` is read natively by most AI coding tools; for the rest, `aigentdocs adapt` generates thin pointer files. Single source of truth, never hand-maintained.

## What's in this repository

| Path | What it is |
|---|---|
| `docs/standard/` | **The product**: the source of truth of the standard that adopters receive — operating rules (`PROTOCOL.md`), agent profiles, area guides, templates, changelog. |
| `docs/project/` | This repo's own documentation, following the standard like any adopting project (see Dogfooding). |
| `packages/core` | `@aigentdocs/core` — all the logic (lint, scaffold, adapt, update) implemented once. |
| `packages/cli` | `aigentdocs` (alias `agd`) — the CLI, a thin wrapper over core. |
| `packages/mcp` | `@aigentdocs/mcp` — MCP server exposing the standard's operations to any MCP-capable agent. |
| `packages/standard` | `@aigentdocs/standard` — the standard as an npm package, synced from `docs/standard/` at build time. |
| `plugins/claude` | The Claude Code plugin: session commands, implementation subagents, lint feedback on Stop. |
| `action.yml` | The reusable GitHub Action that runs the lint in adopters' CI. |

## Dogfooding

This repository documents itself with its own standard (see `docs/project/`), lints itself in CI, and several releases were driven by defects that dogfooding surfaced. The release bundle is even assembled by running our own `init`.

## Status

Early and moving fast — the standard is at v1.5.x, the CLI at 0.1.x. Things may change between minor versions until 1.0.

## License

[MIT](LICENSE)

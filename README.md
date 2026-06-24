# AIGentDocs

> Docs as Code for AI-augmented software engineering: living documentation that agents design, build from, and keep in sync with the code.

AIGentDocs is a **framework** for AI-augmented software engineering, built on a **docs-as-code standard** and the tooling that makes it enforceable. It treats a project's documentation the way you treat source code — versioned in the repo, reviewed in pull requests, validated in CI — so it becomes a **living, trustworthy source of truth** that AI coding agents can rely on to understand a project, design it, and implement it.

## The idea: documentation as code

An AI agent is only as good as the context it's given, and context that isn't versioned or enforced drifts from reality — a stale spec is worse than none. AIGentDocs' foundational bet is to make documentation a first-class, code-grade artifact:

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

Then open the repo with your AI agent and point it at `docs/standard/AGENT.md`: for a new project it drafts `vision.md` with you (design first); for existing code it reverse-engineers the docs (onboarding). The agent drafts, you approve.

The full workflow, commands, and operating rules live in **`docs/standard/AGENT.md`** and the area guides (`docs/standard/guide_*.md`).

## Tool compatibility

The markdown core works with any agent, IDE, or model. `AGENTS.md` is read natively by most AI coding tools (Codex, Cursor, Copilot, the Antigravity ecosystem, and others); for the rest, `aigentdocs adapt` generates thin pointer files. Single source of truth, never hand-maintained.

## Dogfooding

This repository documents itself with its own standard (see `docs/project/`), lints itself in CI, and several releases were driven by defects that dogfooding surfaced. The release bundle is even assembled by running our own `init`.

## Status

Early and moving fast — the standard is at v1.4.x, the CLI at 0.1.x. Things may change between minor versions until 1.0.

## License

[MIT](LICENSE)

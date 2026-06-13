# AIGentDocs

> Living domain documentation for AI coding agents — not throwaway specs.

AIGentDocs is a **docs-as-code standard** plus a small **deterministic CLI**. It structures a software project's documentation so that AI coding agents — any of them — can understand the project deeply, contribute code that fits the design, and never outrun what was actually decided.

## The problem

AI coding agents are only as good as the context they're given. Without structure, every session re-explains the project; with throwaway per-feature specs, the context ages the moment the feature ships. And documentation that nothing enforces always drifts away from the code.

AIGentDocs answers with three moves:

1. **Durable documentation, structured for agents**: four layers (product, architecture, engineering, decisions) with reading protocols that load the minimum context a task needs.
2. **Discovered, not dumped**: Domain-Driven Design (Knowledge Crunching) drives what gets documented; humans approve every document.
3. **Enforced, not promised**: a deterministic linter — no LLM involved — validates structure, consistency, and completeness on every commit and PR.

## Quick start

Scaffold the structure into your repository — no install needed:

```bash
npx aigentdocs init          # docs/ + the AGENTS.md entry point
```

From there you build the documentation **in dialogue with your AI agent of choice**: the agent drafts, you review and approve — nothing is final without review. Two entry points, depending on whether code already exists:

**A new project — design first.** No code yet, so you capture the design as documentation and let it guide the implementation. This is where the framework was born. Start with `vision.md`: tell the agent what you're building, and through Knowledge Crunching (DDD) it discovers the domain, glossary, and scope with you, then drafts the document. Approve it and continue — domain modules → roadmap → architecture → engineering — one document at a time.

**An existing project — onboarding.** Already have code? Point the agent at the framework and it reverse-engineers your codebase into drafts, from the concrete to the abstract:

```
Analyze this project's code and complete the documentation following
the framework in docs/. Start by reading docs/standard/AGENT.md.
```

Either way, once the docs exist every agent that later opens the repo finds its operating rules on its own — `AGENTS.md` is read natively by most AI coding tools.

## Two ways to use it

The CLI works in two modes — most projects use both, in this order:

**1. Bootstrap — `npx aigentdocs init` (no install).** Run once to scaffold `docs/` and the `AGENTS.md` entry point into your repo. `npx` fetches and runs the CLI on the spot — it adds no npm dependency to your project. From here you build the documentation with an agent (see Quick start above).

**2. Adopt — `npm i -D aigentdocs` (dev dependency).** When the standard becomes part of how the project is built, install the CLI. Now `agd`/`aigentdocs` resolve locally — pinned to one version your whole team and CI share — the pre-commit hook works (it looks for the local install), and `lint`/`update` become part of the everyday workflow.

> **Example.** Maya spins up a new service and runs `npx aigentdocs init` to lay down the docs — she won't add a dependency just to create files. A week later the team commits to the standard for real, so she runs `npm i -D aigentdocs` and `agd hooks install`: from then on every commit is checked locally and CI validates each PR.

## Commands

Run a command as `agd <command>` (once installed) or `npx aigentdocs <command>` (ad-hoc); `agd` is the short alias for `aigentdocs`. The one-shot commands — `init`, `lint`, `adapt`, `update` — work either way. `hooks install` needs the installed mode: the hook it writes looks for the local CLI on every commit.

| Command | What it does |
|---|---|
| `agd init [--lite]` | Scaffold the structure (`--lite`: minimal 3-file profile) |
| `agd lint` | Validate documentation compliance — deterministic, exit 1 on critical findings |
| `agd hooks install` | Install the pre-commit check (requires the package installed locally; only criticals block, `--no-verify` always available) |
| `agd adapt` | Generate entry files for tools that don't read `AGENTS.md` |
| `agd update [--check]` | Upgrade your copy of the standard, with migration notes |

## How it's organized

| Layer | Directory | Question it answers |
|---|---|---|
| Product | `docs/project/01_product/` | Why does this exist? What does it do? |
| Architecture | `docs/project/02_architecture/` | What was built? How does it connect? |
| Engineering | `docs/project/03_engineering/` | What technical rules apply? |
| Decisions | `docs/project/04_adrs/` | Why were these choices made? |

Work happens in **sessions** with bounded write scopes, agents operate under explicit rules (`docs/standard/AGENT.md`), and the **Anti-Drift Protocol** ties every code change to the documentation it must update. When reality proves the design wrong, a **Correction Record** fixes the documentation first — with an approved impact map as the audit trail — and the code follows.

- **The standard itself**: [`docs/standard/README.md`](docs/standard/README.md) — structure, protocols, and conventions
- **Agent operating rules**: [`docs/standard/AGENT.md`](docs/standard/AGENT.md)
- **Changelog**: [`docs/standard/changelog.yaml`](docs/standard/changelog.yaml)

## Tool compatibility

The core is markdown — it works with **any** agent, IDE, or model. `AGENTS.md` is read natively by OpenAI Codex, Cursor, GitHub Copilot, the Antigravity ecosystem, and 30+ other tools. For the rest, `aigentdocs adapt` generates thin pointer files (`CLAUDE.md`, `.cursor/rules`, `copilot-instructions.md`, `GEMINI.md`) — single source of truth, never hand-maintained.

CI enforcement via the reusable Action:

```yaml
- uses: actions/checkout@v4
- uses: rodrigo-amc/AIGentDocs@main
  with:
    fail-on: critical   # or 'never' to report without failing
```

## Dogfooding

This repository documents itself with its own standard (see [`docs/project/`](docs/project/) and [`AGENTS.md`](AGENTS.md)), lints itself in CI, and the standard's last four releases were driven by defects that dogfooding surfaced. The release bundle is assembled by running our own `init`.

## Status

Early and moving fast. The standard is at v1.4.x (see the [changelog](docs/standard/changelog.yaml)); the CLI is `0.1.x`. Things may change between minor versions until 1.0.

## License

[MIT](LICENSE)

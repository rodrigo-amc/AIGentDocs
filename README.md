# AIGenticDocs

> Living domain documentation for AI coding agents — not throwaway specs.

AIGenticDocs is a **docs-as-code standard** plus a small **deterministic CLI**. It structures a software project's documentation so that AI coding agents — any of them — can understand the project deeply, contribute code that fits the design, and never outrun what was actually decided.

## The problem

AI coding agents are only as good as the context they're given. Without structure, every session re-explains the project; with throwaway per-feature specs, the context ages the moment the feature ships. And documentation that nothing enforces always drifts away from the code.

AIGenticDocs answers with three moves:

1. **Durable documentation, structured for agents**: four layers (product, architecture, engineering, decisions) with reading protocols that load the minimum context a task needs.
2. **Discovered, not dumped**: Domain-Driven Design (Knowledge Crunching) drives what gets documented; humans approve every document.
3. **Enforced, not promised**: a deterministic linter — no LLM involved — validates structure, consistency, and completeness on every commit and PR.

## Quick start

```bash
npx aigenticdocs init          # scaffold docs/ + the AGENTS.md entry point
npx aigenticdocs hooks install # compliance check on every commit (bypassable, consciously)
```

Then open your repository with your AI tool of choice and say:

```
Analyze this project's code and complete the documentation following
the framework in docs/. Start by reading docs/standard/AGENT.md.
```

The agent enters **Onboarding Mode**, reverse-engineers your code into documentation drafts, and you approve each one. From then on, every agent that opens the repo finds its operating rules on its own — `AGENTS.md` is read natively by most AI coding tools.

| Command | What it does |
|---|---|
| `init [--lite]` | Scaffold the structure (`--lite`: minimal 3-file profile) |
| `lint` | Validate documentation compliance — deterministic, exit 1 on critical findings |
| `hooks install` | Pre-commit check; only criticals block, `--no-verify` always available |
| `adapt` | Generate entry files for tools that don't read `AGENTS.md` |
| `update [--check]` | Upgrade your copy of the standard, with migration notes |

Once installed (`npm i -D aigenticdocs`), the short alias **`agd`** works everywhere.

**No tooling?** The standard is plain markdown. Grab the bundle from [Releases](https://github.com/rodrigo-amc/AIGentDocs/releases) and unpack it at your repository root — everything works manually.

## How it's organized

| Layer | Directory | Question it answers |
|---|---|---|
| Product | `docs/project/01_product/` | Why does this exist? What does it do? |
| Architecture | `docs/project/02_architecture/` | What was built? How does it connect? |
| Engineering | `docs/project/03_engineering/` | What technical rules apply? |
| Decisions | `docs/project/04_adrs/` | Why were these choices made? |

Work happens in **sessions** with bounded write scopes, agents operate under explicit rules (`docs/standard/AGENT.md`), and the **Anti-Drift Protocol** ties every code change to the documentation it must update. When reality proves the design wrong, a **Correction Record** fixes the documentation first — with an approved impact map as the audit trail — and the code follows.

- **Usage guide**: [`docs/standard/QUICKSTART.md`](docs/standard/QUICKSTART.md)
- **The standard itself**: [`docs/standard/README.md`](docs/standard/README.md)
- **Changelog**: [`docs/standard/changelog.yaml`](docs/standard/changelog.yaml)

## Tool compatibility

The core is markdown — it works with **any** agent, IDE, or model. `AGENTS.md` is read natively by OpenAI Codex, Cursor, GitHub Copilot, the Antigravity ecosystem, and 30+ other tools. For the rest, `aigenticdocs adapt` generates thin pointer files (`CLAUDE.md`, `.cursor/rules`, `copilot-instructions.md`, `GEMINI.md`) — single source of truth, never hand-maintained.

CI enforcement via the reusable Action:

```yaml
- uses: actions/checkout@v4
- uses: rodrigo-amc/AIGentDocs@main
  with:
    fail-on: critical   # or 'never' to report without failing
```

## How it compares

Spec-driven development has excellent tools — pick the one whose philosophy fits your project:

| If you want... | Consider |
|---|---|
| Per-feature specs with a huge community and 30+ agent integrations | [GitHub Spec Kit](https://github.com/github/spec-kit) |
| An integrated IDE taking you requirements → design → tasks | AWS Kiro |
| A full agile method with role-playing agents (analyst, architect, QA) | [BMAD-Method](https://github.com/bmadcode/BMAD-METHOD) |
| Lightweight change proposals as the unit of work | OpenSpec |
| **Durable domain documentation as the source of truth** — DDD-driven discovery, a first-class brownfield path, deterministic enforcement, and one context that works across every tool | **AIGenticDocs** |

The honest difference: those tools mostly center the **spec of the next change**; AIGenticDocs centers the **living documentation of the whole system**, with change management (corrections, ADRs) built around it. If your project is a quick prototype, our Lite Mode is the fair comparison — and Spec Kit may still serve you better.

## Dogfooding

This repository documents itself with its own standard (see [`docs/project/`](docs/project/) and [`AGENTS.md`](AGENTS.md)), lints itself in CI, and the standard's last four releases were driven by defects that dogfooding surfaced. The release bundle is assembled by running our own `init`.

## Status

Early and moving fast. The standard is at v1.4.x (see the [changelog](docs/standard/changelog.yaml)); the CLI is `0.1.x`. Things may change between minor versions until 1.0.

## License

[MIT](LICENSE)

# Roadmap

The day-to-day task board lives in [`docs/project/01_product/roadmap.md`](docs/project/01_product/roadmap.md) (this repo dogfoods its own standard). This file is the high-level picture.

## Done

- **Phase 0 — Foundational decisions**: English as the primary language, MIT license, the layered architecture for tool-agnosticism (markdown core → AGENTS.md entry → deterministic enforcement → MCP tooling → thin per-tool adapters).
- **Phase 1 — Standard v1.4**: AGENTS.md entry point, Lite Mode, the Anti-Drift Protocol, status artifacts (`project_status.yaml`, `TODO.md`), operational patterns, Implementation Mode agent profiles, and the `05_corrections` session (cross-cutting design fixes with an approved impact map as the write scope).
- **Phase 2 — Tooling**: the `aigentdocs` CLI (`init`, `lint`, `hooks install`, `adapt`, `update`), a reusable GitHub Action, the no-CLI release bundle, and the first publication to npm (`aigentdocs`, `@aigentdocs/core`, `@aigentdocs/standard`).
- **Phase 3 — Multi-agent tooling**: the MCP server (`@aigentdocs/mcp`, seven tools over the CLI's core: status, active task, modules, sessions with write scopes, corrections, state sync, lint) and the Claude Code plugin (the session protocols as commands, the implementation profiles as subagents, lint feedback on Stop) as the first native adapter.

## Next

- **Phase 4 — Community**: showcase projects, announcement, and a validation metric (the signal that the project lives beyond its author).

## Smaller pending items

- npm release of standard v1.5.0 (the `AGENT.md` → `PROTOCOL.md` rename) with the matching `core`/`cli`/`mcp` bumps.
- Per-language heading catalogs for the linter (today the section checks know the English canonical headings only).
- A mechanical Table-of-Contents contract for project files (deferred until designed).
- Release automation from CI (npm Automation token).

## Deliberately out of scope (for now)

- **Team concurrency** (multiple developers + agents over the same docs): the session model assumes one developer + one agent. Revisited when real teams adopt the framework.
- Telemetry of any kind.

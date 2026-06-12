# Roadmap

The day-to-day task board lives in [`docs/project/01_product/roadmap.md`](docs/project/01_product/roadmap.md) (this repo dogfoods its own standard). This file is the high-level picture.

## Done

- **Phase 0 — Foundational decisions**: English as the primary language, MIT license, the layered architecture for tool-agnosticism (markdown core → AGENTS.md entry → deterministic enforcement → MCP tooling → thin per-tool adapters).
- **Phase 1 — Standard v1.4**: AGENTS.md entry point, Lite Mode, the Anti-Drift Protocol, status artifacts (`project_status.yaml`, `TODO.md`), operational patterns, Implementation Mode agent profiles, and the `05_corrections` session (cross-cutting design fixes with an approved impact map as the write scope).
- **Phase 2 — Tooling**: the `aigenticdocs` CLI (`init`, `lint`, `hooks install`, `adapt`, `update`), a reusable GitHub Action, the no-CLI release bundle, and the first publication to npm (`aigenticdocs`, `@aigenticdocs/core`, `@aigenticdocs/standard`).

## Next

- **Phase 3 — Multi-agent tooling**: an MCP server exposing the standard's operations (`get_active_task`, `get_module`, `start_session`, `validate_docs`, ...) to any MCP-capable agent, sharing the CLI's core; a Claude Code plugin (skills compiled from the standard's session protocols, subagents from the agent profiles, an optional Session Guard hook) as the first native adapter.
- **Phase 4 — Community**: honest ecosystem comparison, showcase projects, and announcement.

## Smaller pending items

- Per-language heading catalogs for the linter (today the section checks know the English canonical headings only).
- A mechanical Table-of-Contents contract for project files (deferred until designed).
- CLI 0.1.1 with the EPIPE fix.
- Release automation from CI (npm Automation token).

## Deliberately out of scope (for now)

- **Team concurrency** (multiple developers + agents over the same docs): the session model assumes one developer + one agent. Revisited when real teams adopt the framework.
- Telemetry of any kind.

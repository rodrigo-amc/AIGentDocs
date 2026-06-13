---
type: vision
version: 1.1
last_updated: 2026-06-12
change_summary: "MCP server and native adapters (Claude Code plugin) now in scope as implemented"
---

# Product Vision — AIGentDocs Tooling

## Elevator Pitch

A minimal command-line tool (and, later, an MCP server) that turns the AIGentDocs standard from passive markdown into an enforced practice: it scaffolds the documentation structure into any repository, deterministically validates it without an LLM, generates per-tool adapter files, and keeps adopters up to date across versions of the standard.

---

## Problem It Solves

The AIGentDocs standard works today by copying markdown files and trusting agents (and humans) to follow the rules. That leaves three gaps: adoption friction (manual copying and setup), compliance as a promise (no mechanical check catches drift between documentation and reality), and upgrade fragmentation (each new version of the standard must be synced by hand into every adopting project). The tooling closes those gaps without ever becoming a requirement — the markdown standard must keep working on its own.

---

## Target Users (Personas)

| Persona | Description | Technical level |
|---|---|---|
| Adopting developer | Sets up AIGentDocs in a new or existing repository and wants it working in minutes (`npx aigentdocs init`). | Professional developer; any stack. |
| Maintaining team / CI | Needs documentation compliance enforced automatically on every commit and PR (`lint` in pre-commit and CI). | Mixed; interacts mostly through CI results. |
| AI coding agent | Operates on an adopting repository and needs deterministic feedback about documentation state (via `lint` output and, later, MCP tools). | Agent (Claude Code, Codex, Antigravity, etc.). |

---

## Project Scope

### In Scope

- `init`: scaffold `docs/` (standard + empty project structure + `AGENTS.md` stub) into a repository, with `--lite` and `--lang` options.
- `lint`: deterministic validation of an adopting project's documentation — exactly the Mechanical layer of `AGENT_REVIEW.md`.
- `adapt`: generation of per-tool adapter files (`CLAUDE.md`, `.cursor/rules`, `copilot-instructions.md`, etc.) from the single source of truth.
- `update`: upgrade an adopter's `docs/standard/` to a newer version of the standard, reporting changes that need human attention.
- Distribution: npm package (npx-runnable), a pre-commit hook template, a reusable GitHub Action, and a no-CLI tarball per release.
- MCP server (`@aigentdocs/mcp`) exposing the standard's operations as tools for any MCP-capable agent, sharing this codebase.
- Native adapters that compile the standard to a specific tool — the first is the Claude Code plugin (commands, subagents, lint hook).

### Out of Scope

- A full terminal application or TUI — the CLI stays minimal by design (architecture decision, Phase 0).
- Semantic validation (AC quality, module cohesion) — that is judgment work, owned by agents via `AGENT_REVIEW.md` Layer 2.
- Editing or authoring project documentation content — humans and agents write docs; the tooling scaffolds and validates.
- Telemetry, accounts, or any network service.

---

## Domain Glossary

| Term | Definition |
|---|---|
| Standard | The contents of `docs/standard/`: the product this repository ships. |
| Adopting project (adopter) | A repository that uses the standard to document itself. |
| Profile | The adoption depth declared by an adopter: `lite` or `full`. |
| Mechanical validation | A documentation check with a deterministic, binary answer (Layer 1 of `AGENT_REVIEW.md`); what `lint` implements. |
| Finding | A single lint result: severity (critical/warning/suggestion) + file + rule + message. |
| Adapter | A generated, tool-specific entry file (e.g., `CLAUDE.md`) derived from the standard; never hand-maintained. |
| Standard version | The release of the standard (per `changelog.yaml`) an adopter is on; what `update` migrates between. |

---

## Domain Entity Map

| Entity | Description | Relationships |
|---|---|---|
| Standard Release | A versioned snapshot of `docs/standard/` with its changelog entry. | Installed into Adopting Projects by `init`/`update`; embedded in the npm package. |
| Adopting Project | A repository with `docs/` under the standard, a declared profile, and a standard version. | Validated by Lint Rules; receives Adapters. |
| Lint Rule | One mechanical validation with an ID, severity, and target document type. | Runs against an Adopting Project; produces Findings. |
| Finding | The result of a rule violation, reported to terminal/CI. | Belongs to a Lint Rule and an Adopting Project. |
| Adapter | A per-tool entry file generated from the Standard Release. | Generated into an Adopting Project by `adapt`. |

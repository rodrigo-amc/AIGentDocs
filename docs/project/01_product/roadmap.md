---
type: roadmap
version: 1.1
last_updated: 2026-06-12
current_phase: "Phase 3 — Multi-agent tooling"
---

# Roadmap — Status and Planning

## Current Phase/Milestone

**Phase 3 — Multi-agent tooling**: give every MCP-capable agent uniform tooling over the standard, and ship the first native adapter (Claude Code plugin). This board tracks the work.

---

## Task Board

### [In Progress]

- [T-13] Claude Code plugin: commands from the session protocols, subagents from the agent profiles, lint feedback hook.

### [To Do / Next]

- [T-14] Publish `@aigentdocs/mcp` + CLI 0.1.1 (EPIPE fix).

### [Blocked / Review]

### [Done]

- [T-12] MCP server (`@aigentdocs/mcp`): seven tools over core (status, active task, module, sessions with write scopes, corrections with status-aware scope, state sync, lint). ADR-0005 (MCP SDK) accepted. Real client/server tests in memory.
- [T-01] Bootstrap the tooling docs (vision, roadmap, tech stack, runtime ADR).
- [T-02] Monorepo skeleton: `packages/core` + `packages/cli`, TypeScript project references, `node:test` runner (per ADR-0002).
- [T-03] `lint` v0: frontmatter validation (presence, required fields, allowed `state`/`status` values, date format, array fields). Depends on ADR-0003 (`yaml` package, accepted).
- [T-04] `lint` v1: reference consistency (tech_stack↔ADRs, `supersedes` reciprocity, `code_paths`, roadmap see-references, project_status authority rule). ToC sync deferred: the ToC contract for project files needs design first.
- [T-05] `lint` v2: [REQUIRED] section presence and non-emptiness per document type, US without ACs (critical) and US > 6 ACs (warning), applied Corrections need a Resolution, oversized Mermaid diagrams (suggestion). English canonical headings only for now — per-language catalogs are future work.
- [T-06] `init`: full profile (structure + dated status artifacts + AGENTS.md, no placeholder content docs) and `--lite` (the three Lite files; a fresh lint then lists the empty sections as the to-do list). Standard ships as `@aigentdocs/standard`, synced at build from docs/standard (ADR-0004, accepted). `--lang` deferred until a frozen Spanish translation exists.
- [T-07] Enforcement, inform-don't-block: `hooks install` writes the pre-commit hook (only criticals block; failure message shows the conscious `--no-verify` bypass; refuses to overwrite an existing hook); reusable composite Action (`action.yml`) with `fail-on: critical | never` and CLI version pinning (works once T-09 publishes to npm); repo CI runs tests + self-lint on every PR.
- [T-08] `adapt`: registry-driven thin pointers to AGENTS.md (single canonical source) for claude (`CLAUDE.md` with `@AGENTS.md` import), cursor (`.cursor/rules`), copilot (`copilot-instructions.md`), antigravity (`GEMINI.md` as the override layer — Antigravity reads AGENTS.md natively since v1.20.3). Generation marker: adapt only overwrites files it generated; hand-edited files are never touched.
- [T-10] No-CLI tarball/zip release per standard version: CI on `standard-v*` tags assembles the bundle by running our own `init` (dogfooding) after verifying tag = changelog = package version (`scripts/check-standard-version.mjs`).
- [T-09] Published to npm (2026-06-11): `@aigentdocs/standard@1.4.3`, `@aigentdocs/core@0.1.0`, `aigentdocs@0.1.0` under the `aigentdocs` org. Verified from a clean directory via `npx aigentdocs@latest` (init + lint) and the `agd` bin alias. Publishing used the maintainer's WebAuthn 2FA; an Automation token will be needed when releases move to CI.
- [T-11] `update [--check]`: zero-config version detection (the adopter's own changelog.yaml copy declares the installed version — no `standard_version` field needed, a simplification over the original design); the changelog entries between versions are the migration notes; a customized README.md is preserved with the incoming one written to README.md.new for manual merge; `--check` reports without touching (exit 1 if outdated, CI-friendly); 'ahead' state tells the adopter to upgrade the CLI instead.

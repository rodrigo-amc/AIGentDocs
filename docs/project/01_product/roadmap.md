---
type: roadmap
version: 1.0
last_updated: 2026-06-11
current_phase: "Phase 2 — CLI v0.1"
---

# Roadmap — Status and Planning

## Current Phase/Milestone

**Phase 2 — CLI v0.1**: turn the standard's mechanical rules into deterministic tooling. Scope and rationale live in the evolution roadmap (Phase 2); this board tracks the work.

---

## Task Board

### [In Progress]

### [To Do / Next]
- [T-08] `adapt`: generate `CLAUDE.md`, `.cursor/rules`, `copilot-instructions.md`, `GEMINI.md` from the standard.
- [T-09] npm publish (`npx aigenticdocs`) — requires reserving the package name first.
- [T-10] No-CLI tarball release per standard version (CI on tag).
- [T-11] `update`: standard upgrades for adopters (`standard_version` field + migration notes).

### [Blocked / Review]

### [Done]

- [T-01] Bootstrap the tooling docs (vision, roadmap, tech stack, runtime ADR).
- [T-02] Monorepo skeleton: `packages/core` + `packages/cli`, TypeScript project references, `node:test` runner (per ADR-0002).
- [T-03] `lint` v0: frontmatter validation (presence, required fields, allowed `state`/`status` values, date format, array fields). Depends on ADR-0003 (`yaml` package, accepted).
- [T-04] `lint` v1: reference consistency (tech_stack↔ADRs, `supersedes` reciprocity, `code_paths`, roadmap see-references, project_status authority rule). ToC sync deferred: the ToC contract for project files needs design first.
- [T-05] `lint` v2: [REQUIRED] section presence and non-emptiness per document type, US without ACs (critical) and US > 6 ACs (warning), applied Corrections need a Resolution, oversized Mermaid diagrams (suggestion). English canonical headings only for now — per-language catalogs are future work.
- [T-06] `init`: full profile (structure + dated status artifacts + AGENTS.md, no placeholder content docs) and `--lite` (the three Lite files; a fresh lint then lists the empty sections as the to-do list). Standard ships as `@aigenticdocs/standard`, synced at build from docs/standard (ADR-0004, accepted). `--lang` deferred until a frozen Spanish translation exists.
- [T-07] Enforcement, inform-don't-block: `hooks install` writes the pre-commit hook (only criticals block; failure message shows the conscious `--no-verify` bypass; refuses to overwrite an existing hook); reusable composite Action (`action.yml`) with `fail-on: critical | never` and CLI version pinning (works once T-09 publishes to npm); repo CI runs tests + self-lint on every PR.

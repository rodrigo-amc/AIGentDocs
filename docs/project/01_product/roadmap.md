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
- [T-04] `lint` v1: reference consistency (roadmap↔modules, tech_stack↔ADRs, `code_paths`, `supersedes` reciprocity, ToC sync, status-artifact consistency).
- [T-05] `lint` v2: [REQUIRED] section presence + countable thresholds (US > 6 ACs, oversized diagrams).
- [T-06] `init`: scaffold docs/ + `AGENTS.md` stub; `--lite`, `--lang` flags.
- [T-07] Pre-commit hook template + reusable GitHub Action running `lint`.
- [T-08] `adapt`: generate `CLAUDE.md`, `.cursor/rules`, `copilot-instructions.md`, `GEMINI.md` from the standard.
- [T-09] npm publish (`npx aigenticdocs`) — requires reserving the package name first.
- [T-10] No-CLI tarball release per standard version (CI on tag).
- [T-11] `update`: standard upgrades for adopters (`standard_version` field + migration notes).

### [Blocked / Review]

### [Done]

- [T-01] Bootstrap the tooling docs (vision, roadmap, tech stack, runtime ADR).
- [T-02] Monorepo skeleton: `packages/core` + `packages/cli`, TypeScript project references, `node:test` runner (per ADR-0002).
- [T-03] `lint` v0: frontmatter validation (presence, required fields, allowed `state`/`status` values, date format, array fields). Depends on ADR-0003 (`yaml` package, proposed).

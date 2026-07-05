---
type: roadmap
version: 1.5
last_updated: 2026-07-05
current_phase: "Phase 4 — Open source & community"
---

# Roadmap — Status and Planning

## Current Phase/Milestone

**Phase 4 — Open source & community**: with the standard, the CLI, the MCP server, and the Claude Code plugin all built and published to npm, the remaining work is opening the project up. (The repository stays private until the phase work is ready.) Phases 1-3 are complete.

---

## Task Board

### [In Progress]

### [To Do / Next]

- [T-16] Open-source prep: decide what's needed before making the repo public (showcase, announcement, automation token for CI publishing). Plugin version governance (decided 2026-07-05 under T-23, from doc observation 1 of the 2026-07-04 plugin review): the Claude Code plugin versions independently with its own semver — any change under `plugins/claude/` bumps `plugin.json` and adds an entry to `plugins/claude/CHANGELOG.md` in the same PR; merging to main is the release (the marketplace points at the repo); bump to `1.0.0` when the repo goes public. Chained engineering follow-up: create the plugin `CHANGELOG.md` (seeded with 0.1.0) and a structure test enforcing the bump-with-changelog rule.
- [T-24] Narrow `init`'s docs/ guard (Maintenance; chained from finding 7 of the 2026-07-04 core review, decided 2026-07-05 under T-23): refuse only when `docs/standard/` or `docs/project/` already exist — an unrelated `docs/` directory must not block adoption (`init` never deletes or overwrites other `docs/` content). Update the guard in `packages/core/src/scaffold.ts` + tests, and surface the behavior in the README/CLI help. The decided behavior is documented in `vision.md` (In Scope, init).
- [T-18] Deferred minor items from the 2026-07-04 code-review triage (details in each report's Disposition, `local_utils/reports/code_reviewer/`): CLI exit-code taxonomy (usage errors → 2; update the coupled assert in `main.test.ts`), plugin structure tests location (repo-level, not `packages/cli/test/`), MCP `SESSION_FILES` existence test against `docs/standard/`, and the standard-design question of a persistent review-report artifact.

### [Blocked / Review]

### [Done]

- [T-23] Session 01_product — `vision.md` aligned with reality and two product decisions settled (design-first items from the 2026-07-04 reviews): `--lang` marked as deferred in the vision (core doc obs 1, → T-06); lint's "exactly the Mechanical layer" claim qualified — structural/ToC checks deferred (core doc obs 2, → T-04); `init` docs/ guard narrowed by decision to `docs/standard/` / `docs/project/` (core finding 7; code change chained as T-24); plugin version governance decided and folded into T-16 (plugin doc obs 1). Vision bumped to 1.2.
- [T-22] Runtime floor and workspaces note in `tech_stack.yaml` (design-first: finding 2 of the 2026-07-04 core review + doc observation 1 of the scaffold review): runtime raised to `>=20.12 (LTS)` — core's `readdir({recursive})` needs Node 20.1 and `Dirent.parentPath` needs 20.12; chained fix mirrors it in the `engines` of the root, core, cli, and mcp package.json (plus the coupled repo-level guard test); npm workspaces note now lists `packages/standard` (ADR-0004).
- [T-21] Scope of ADR-0003's `yaml` import restriction (design-first, finding 2 of the 2026-07-04 scaffold review): ADR-0008 accepted — the Compliance clause covers published packages only; repo build scripts may import `yaml` directly, declared as a root devDependency (never via hoisting); propagated to `tech_stack.yaml` (yaml_parser note); chained fix: `yaml ^2.9.0` added to root devDependencies, legitimizing `scripts/check-standard-version.mjs`'s import.
- [T-20] Internal dependency pinning policy (design-first, finding 1 of the 2026-07-04 scaffold review): ADR-0007 accepted — every internal `@aigentdocs/*` dependency in published packages is pinned exact, released in lockstep; propagated to `tech_stack.yaml` (global constraint); chained fix: `@aigentdocs/standard` `^1.5.0` → `1.5.0` in `packages/cli/package.json`.
- [T-19] Maintenance batch from the 2026-07-04 code-review triage: every "fix"-disposition item across the five reports in `local_utils/reports/code_reviewer/` — core: frontmatter-bounded `updateModuleState` edit (highest priority), `compareVersions` input validation, `adr: null` handled like `""`, BOM-tolerant frontmatter, staged wholesale replace in `update`; scaffold: `action.yml` inputs via `env:` (all three), root `engines.npm >=10`; CLI: pre-commit hook guards on a locally resolved CLI (inform-don't-block), CLI-level tests for `update` exit codes, `adapt` parsing, and warnings-only lint; MCP: handshake version from package.json, `--root` without value errors out, fixture-repo happy-path tests for the three untested tools; plugin: Stop hook resolves the CLI locally and requires non-empty lint output, aligned hooks.json description, shell-level hook branch tests.
- [T-17] Standard v1.5.0: `AGENT.md` renamed to `PROTOCOL.md` — the one-letter collision with the `AGENTS.md` entry-point convention confused humans and agents (surfaced by an external AI review of the README). References propagated across the standard, templates, CLI/MCP generated output, and the Claude Code plugin; historical changelog entries left untouched. README improved for comprehension: early "start here" pointer, repository map table, adaptation-layers diagram, no-CLI adoption path, "permanent, not per-feature" positioning (no direct tool comparisons by choice).
- [T-14] Published to npm (2026-06-14): `@aigentdocs/standard@1.4.6`, `@aigentdocs/core@0.1.1`, `@aigentdocs/mcp@0.1.0` (first release), `aigentdocs@0.1.1` (EPIPE fix). Verified from a clean directory: `npx aigentdocs@latest` scaffolds the 1.4.6 standard; the MCP package resolves `core@0.1.1`.
- [T-15] Documentation restructure: the root README is the single human-facing guide (QUICKSTART removed); `docs/standard/README.md` pruned to the spec; project conventions moved to `AGENTS.md`; `update` replaces `docs/standard/` wholesale. Recorded as ADR-0006; standard v1.4.6.
- [T-13] Claude Code plugin (first native Layer 4 adapter): six commands from the session protocols, four subagents from the implementation profiles, a Stop hook running the lint. Structure tests.
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
- [T-11] `update [--check]`: zero-config version detection (the adopter's own changelog.yaml copy declares the installed version — no `standard_version` field needed, a simplification over the original design); the changelog entries between versions are the migration notes; `docs/standard/` is replaced wholesale (it carries nothing project-specific — see ADR-0006); `--check` reports without touching (exit 1 if outdated, CI-friendly); 'ahead' state tells the adopter to upgrade the CLI instead.

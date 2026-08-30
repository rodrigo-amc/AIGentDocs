# Changelog — AIGentDocs plugin for Claude Code

The plugin versions independently of the standard and of the CLI: any change under `plugins/claude/` bumps the version in `.claude-plugin/plugin.json` and adds an entry here in the same PR. Merging to `main` is the release — the marketplace points at the repository.

## 0.2.0 — 2026-08-30

### Added

- `project-expert` subagent, compiling the standard's Consultation Mode profile (`agent_project_expert.md`, standard 1.6.0): answers cross-cutting questions about the project or the standard, read-only and citing its sources. It is also the subagent the other four can call when a session needs an answer from outside its write scope.

## 0.1.0 — 2026-06-13

### Added

- First release. Six commands compiling the standard's session protocols (`session`, `onboard`, `new-module`, `adr`, `correction`, `audit`), four subagents compiling its Implementation Mode profiles (`scaffold`, `module-developer`, `code-reviewer`, `integration-tester`), and a `Stop` hook that runs the linter and feeds critical findings back before the turn ends.

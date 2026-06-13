# AIGentDocs plugin for Claude Code

Operate the [AIGentDocs](https://github.com/rodrigo-amc/AIGentDocs) docs-as-code standard from Claude Code. Everything here is a thin compilation of the standard: commands wrap its session protocols, subagents wrap its implementation profiles, and all of them read the **adopting project's own `docs/standard/`** — version-correct, single source of truth.

## Install

```bash
claude plugin marketplace add rodrigo-amc/AIGentDocs
claude plugin install aigentdocs@aigentdocs
```

## Commands

| Command | What it starts |
|---|---|
| `/aigentdocs:session <type>` | A documentation session with its write scope |
| `/aigentdocs:onboard` | Onboarding Mode: reverse-engineer code into docs |
| `/aigentdocs:new-module <name>` | One domain module (Senior Domain Analyst) |
| `/aigentdocs:adr <title>` | One architectural decision record |
| `/aigentdocs:correction <id\|new>` | A cross-cutting design correction |
| `/aigentdocs:audit` | Lint (mechanical) + semantic review |

## Subagents

`scaffold`, `module-developer`, `code-reviewer`, `integration-tester` — the standard's Implementation Mode profiles, ready to delegate to.

## Hook

A `Stop` hook runs `npx aigentdocs lint` when the project is documented with the standard and feeds critical findings back before the turn ends (anti-drift). Disable with `AIGENTDOCS_STOP_LINT=off`. Pre-commit and CI enforcement come from the CLI itself (`npx aigentdocs hooks install`), not from this plugin.

## Pairs well with

The [`@aigentdocs/mcp`](https://www.npmjs.com/package/@aigentdocs/mcp) server: `claude mcp add aigentdocs -- npx -y @aigentdocs/mcp` gives the same session/status/lint operations as typed tools.

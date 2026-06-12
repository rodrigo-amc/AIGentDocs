# Contributing to AIGenticDocs

Thanks for your interest! This repository holds three different things, and contributions flow differently through each:

| Surface | Where | What a change involves |
|---|---|---|
| **The standard** (the product) | `docs/standard/` | A changelog entry in `changelog.yaml`, a version bump in `packages/standard/package.json` (they must match — CI checks), and consistency between guides and templates. |
| **The tooling** (CLI, core) | `packages/` | TypeScript strict, tests with `node:test`, and **no new dependencies without an ADR** (see `docs/project/04_adrs/`). |
| **This repo's own docs** | `docs/project/` | This repository documents itself with its own standard — changes follow the rules in `docs/standard/AGENT.md` (sessions, Anti-Drift Protocol). |

## Development setup

```bash
npm ci        # Node >= 20
npm test      # build (tsc -b, with standard sync) + 67 tests
node packages/cli/dist/src/index.js lint   # self-lint our own docs
```

## Pull request checklist

- [ ] `npm test` passes.
- [ ] The self-lint stays clean (CI runs it on every PR).
- [ ] If you touched `docs/standard/`: changelog entry + version bump in `packages/standard/package.json`.
- [ ] If you added a dependency: an ADR in `docs/project/04_adrs/` justifying it.
- [ ] If your change starts or finishes project work: the board in `docs/project/01_product/roadmap.md` reflects it (Anti-Drift Protocol).

## Working with AI agents

This repo is agent-friendly by design: `AGENTS.md` at the root defines the operating rules. PRs produced with AI assistance are welcome — the same checklist applies, and we appreciate honest attribution (e.g., a `Co-Authored-By` trailer).

## Proposing changes to the standard

The standard evolves through **dogfooding evidence**: the strongest proposals come from a real project where the current rules failed or fell short. Open an issue describing the situation the standard didn't handle — the defect, not just the solution.

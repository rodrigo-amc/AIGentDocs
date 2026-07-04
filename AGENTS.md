# AI Agent Instructions

This repository is **AIGentDocs itself** — a docs-as-code **framework** (the **standard** plus its tooling). It dogfoods its own standard, with one critical distinction:

- **`docs/standard/` is the product.** It is the source of truth of the standard that adopters receive. Treat it as source code: changes to it are releases of the standard, recorded in `changelog.yaml` — never project bookkeeping.
- **`docs/project/` documents this repo's tooling** (the `aigentdocs` CLI and MCP server), following the standard like any adopting project would.

## Entry point

Read **`docs/standard/PROTOCOL.md`** for the operating rules, then follow the Reading Protocol in `docs/standard/README.md` scoped to `docs/project/`.

## Conventions for this repository

| Convention | Value |
|---|---|
| Documentation language | English (US) |
| Adoption profile | `lite` (see Lite Mode in `docs/standard/README.md`) |
| Note | `docs/standard/README.md` is the product and is NOT customized for this repo; the conventions above replace that customization. |

## Non-negotiable rules (summary — `PROTOCOL.md` is authoritative)

1. **Do not generate code** without first reading `docs/project/03_engineering/tech_stack.yaml`.
2. **Do not install or propose dependencies** without discussing it with the human developer and recording an ADR.
3. **Do not assume undocumented information.** If it's not in `docs/project/`, ask before proceeding.
4. **Keep traceability:** update the board in `docs/project/01_product/roadmap.md` when starting or completing a task.

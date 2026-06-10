# AI Agent Instructions

<!-- AIGenticDocs stub — copy this file to the root of the adopting repository.
     Tools that read CLAUDE.md (Claude Code) or GEMINI.md instead of AGENTS.md:
     create a symlink (ln -s AGENTS.md CLAUDE.md) or an identical copy. -->

This project is documented under the **AIGenticDocs** docs-as-code standard. The documentation in `docs/project/` is the **source of truth** for what this software is, how it is designed, and which technical rules apply.

## Entry point

Before doing any work, read **`docs/standard/AGENT.md`** — it defines your operating rules, working modes (Onboarding, Design, Implementation), and session management. Then follow the **Reading Protocol** in `docs/standard/README.md` to load project context at the lowest token cost.

## Non-negotiable rules (summary — `AGENT.md` is authoritative)

1. **Do not generate code** without first reading `docs/project/03_engineering/tech_stack.yaml`. Use only the technologies, versions, and libraries listed there.
2. **Do not install or propose dependencies** without discussing it with the human developer and recording an ADR.
3. **Do not assume undocumented information.** If it's not in `docs/project/`, ask before proceeding.
4. **Keep traceability:** when starting or completing a task, update the board in `docs/project/01_product/roadmap.md` and the `state` field of affected documents.

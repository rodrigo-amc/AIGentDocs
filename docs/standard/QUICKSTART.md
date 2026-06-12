# Usage Guide — Docs-as-Code Framework

This guide explains how to adopt this framework in a software project, how to work with it, and how to leverage it to power AI-assisted development.

---

## What is this framework?

It is a **docs-as-code standard** that structures a software project's documentation into 4 layers:

| Layer | Directory | Question it answers |
|---|---|---|
| **Product** | `01_product/` | **Why** does this software exist? What does it do? |
| **Architecture** | `02_architecture/` | **What** was built? How does it all connect? |
| **Engineering** | `03_engineering/` | **How** is it built? What technical rules apply? |
| **Decisions** | `04_adrs/` | **Why** were these decisions made? |

Each area of the standard has a `guide_*.md` (structure and format) and an `agent_*.md` (operating rules for AI agents).

---

## Installation

### Option 1 — With the CLI (recommended)

```bash
# Scaffold everything: docs/standard/, the docs/project/ tree,
# the status artifacts, and the AGENTS.md entry point at the root.
npx aigentdocs init          # or: npx aigentdocs init --lite

# Optional but recommended:
npx aigentdocs hooks install   # pre-commit compliance check (bypass: --no-verify)
npx aigentdocs adapt           # entry files for tools that don't read AGENTS.md
```

`AGENTS.md` is the de facto standard entry file read natively by most AI coding tools (Codex, Cursor, Copilot, the Antigravity ecosystem, and others). With it in place, any agent that opens your repo discovers the framework on its own — no one has to tell it where to start.

### Option 2 — Without tooling

The standard is plain markdown and works with no CLI at all:

- Download the bundle attached to any [standard release](https://github.com/rodrigo-amc/AIGentDocs/releases) and unpack it at your repository root, **or**
- Copy the `docs/` folder from the repository manually, then copy `docs/standard/templates/AGENTS.md` to your repository root. For tools that read a different file name: `ln -s AGENTS.md CLAUDE.md`.

### Then, for either option:

#### 1. Customize the README

Open `docs/standard/README.md` and replace:

- The title `# Documentation Standard...` → `# [Your project's name]`
- The generic description → A 1-2 line description of your project

#### 2. Set the conventions

In the **Conventions** section of `docs/standard/README.md`, define:

- **Documentation language**: Spanish, English, etc.

#### 3. Commit

```bash
git add docs/ AGENTS.md
git commit -m "docs: adopt docs-as-code framework"
```

---

## How to fill out the documentation

### Option A: Manually (Design Mode)

Go file by file following each template's structure. The HTML comments (`<!-- -->`) inside each file explain what to write in each section. The reference templates live in `standard/templates/`; the agent uses them as the blueprint for creating files in `project/`.

The recommended order depends on the type of project — see the **Adoption Guide** in `standard/README.md` (Greenfield, Brownfield, and Lite paths).

### Option B: With an AI agent (Onboarding Mode)

This is the flow designed for existing projects. Tell the agent:

```
Analyze this project's code and complete the documentation following
the framework in docs/. Start by reading docs/standard/AGENT.md.
```

The agent will:

1. Read `AGENT.md` and detect that the docs are empty (placeholders).
2. Automatically enter **Onboarding Mode**.
3. Analyze the source code.
4. Generate drafts of each document for your review.
5. You approve or adjust each document.

> **Important:** The agent generates, the human approves. No document is considered final without review.

### Option C: Lite Mode (small projects)

For prototypes, internal tools, or single-purpose services, you don't need the full structure. The **Lite** profile is just three files: `vision.md`, `roadmap.md`, and `tech_stack.yaml` — what an agent minimally needs to contribute safely. User Stories live directly on the roadmap board, ADRs are optional, and you upgrade incrementally only when the project's complexity demands it.

`npx aigentdocs init --lite` scaffolds the three files from the templates; running `npx aigentdocs lint` right after lists their empty [REQUIRED] sections — that report is your documentation to-do list.

See **Lite Mode** in the Adoption Guide of `standard/README.md` for the rules and the upgrade path.

---

## Day-to-day workflow

Once the documentation is complete, the workflow with an AI agent is:

### Adding a new feature

```
1. The human or the agent adds the User Story to the corresponding domain_module.
2. The task is moved to [In Progress] in roadmap.md.
3. The agent reads the relevant docs (Reading Protocol) and generates code.
4. When done, the task is moved to [Done] and the module's state is updated.
```

### Changing the architecture

```
1. An ADR is created in 04_adrs/ justifying the change.
2. The human approves the ADR (status: accepted).
3. The affected documents in 02_architecture/ and 03_engineering/ are updated.
4. The change is implemented in code.
```

### Adding a new dependency

```
1. It is discussed with the human developer.
2. An ADR is created justifying the addition.
3. tech_stack.yaml is updated with the new technology.
4. It is used in the code.
```

---

## File structure

The complete tree — which files belong to the framework (`standard/`, read-only) and which are filled out per project (`project/`), with the purpose of each — is documented in the **Directory Structure** section of `standard/README.md`. Its Table of Contents is kept up to date as files are added or removed.

---

## Auditing

Auditing has two layers (see `AGENT_REVIEW.md`):

**Mechanical layer — deterministic, no LLM.** Run the linter:

```bash
npx aigentdocs lint
```

It checks structure, frontmatter, reference consistency, [REQUIRED] sections, and countable thresholds. Wire it into every commit and PR with `npx aigentdocs hooks install` and the reusable GitHub Action (`uses: rodrigo-amc/AIGentDocs@main`). Only critical findings block — and the bypass (`git commit --no-verify`) is always available, consciously.

**Semantic layer — judgment, an agent's job.** Use the audit prompt:

```
Run the documentation audit following the instructions in docs/standard/AGENT_REVIEW.md.
```

The agent reviews content quality, cohesion, and cross-document coherence. Both layers report with the same severities (🔴 Critical, 🟡 Warning, 🟢 Suggestion).

---

## Keeping the standard up to date

Your copy of the standard declares its version (top entry of `docs/standard/changelog.yaml`). To check for and apply newer versions:

```bash
npx aigentdocs update --check   # report only (CI-friendly: exit 1 if outdated)
npx aigentdocs update           # apply, showing the migration notes
```

A customized `docs/standard/README.md` is preserved; the incoming version lands in `README.md.new` for manual merging.

---

## Agent working modes

Agents operate in one of three modes — **Onboarding** (existing code, empty docs: analyze and draft), **Design** (write docs, no code), and **Implementation** (write code, with docs as the source of truth). The authoritative definitions and entry criteria are in `standard/AGENT.md` (Working Modes).

---

## Key conventions

Frontmatter fields and the `state` lifecycle are defined once in `standard/README.md` (Frontmatter Conventions). ADR rules — immutability, the supersede process — are in `standard/guide_adrs.md`. The synchronization duties that keep docs and code from drifting apart are in `standard/AGENT.md` (Anti-Drift Protocol).

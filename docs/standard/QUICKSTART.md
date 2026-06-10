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

Each layer has a `README.md` (what it contains and how to fill it out) and an `AGENT.md` (instructions for AI agents).

---

## Installation

### 1. Copy the `docs/` folder into your repository

```bash
# From the root of your project
cp -r /path/to/framework/docs ./docs
```

Or simply copy the entire `docs/` folder to the root of your repository. The structure includes `docs/standard/` (the framework) and `docs/project/` (where your project's documentation will live).

### 2. Copy the agent entry point to the repository root

```bash
cp docs/standard/templates/AGENTS.md ./AGENTS.md
```

`AGENTS.md` is the de facto standard entry file read natively by most AI coding tools (Codex, Cursor, Copilot, Gemini, and others). With it in place, any agent that opens your repo discovers the framework on its own — no one has to tell it where to start.

For tools that read a different file name, link or copy it:

```bash
ln -s AGENTS.md CLAUDE.md   # Claude Code
```

### 3. Customize the README

Open `docs/standard/README.md` and replace:

- The title `# Documentation Standard...` → `# [Your project's name]`
- The generic description → A 1-2 line description of your project

### 4. Set the conventions

In the **Conventions** section of `docs/standard/README.md`, define:

- **Documentation language**: Spanish, English, etc.

### 5. Commit

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

To verify that the documentation complies with the standard, use the audit prompt:

```
Run the documentation audit following the instructions in docs/standard/AGENT_REVIEW.md.
```

The agent will review: structure, frontmatter, required sections, consistency, and quality. The result is a report with severities (🔴 Critical, 🟡 Warning, 🟢 Suggestion).

---

## Agent working modes

Agents operate in one of three modes — **Onboarding** (existing code, empty docs: analyze and draft), **Design** (write docs, no code), and **Implementation** (write code, with docs as the source of truth). The authoritative definitions and entry criteria are in `standard/AGENT.md` (Working Modes).

---

## Key conventions

Frontmatter fields and the `state` lifecycle are defined once in `standard/README.md` (Frontmatter Conventions). ADR rules — immutability, the supersede process — are in `standard/guide_adrs.md`. The synchronization duties that keep docs and code from drifting apart are in `standard/AGENT.md` (Anti-Drift Protocol).

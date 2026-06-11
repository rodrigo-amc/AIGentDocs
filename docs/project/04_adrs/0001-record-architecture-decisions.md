---
type: adr
id: 1
version: 1.0
last_updated: 2026-06-11
status: accepted
date: 2026-06-11
decision_makers: [rodrigo-amc]
supersedes: null
superseded_by: null
---

# 0001 - Record Architecture Decisions

## Context and Problem

The AIGenticDocs tooling (CLI and MCP server) is a software project in its own right, developed inside the same repository as the standard it serves. We need a formal mechanism to record its significant technical decisions so that any team member — human or AI agent — can understand the project's evolution. Using the standard's own ADR process is also a deliberate act of dogfooding.

## Decision

We will use Architecture Decision Records (ADRs) stored in `docs/project/04_adrs/`, following the structure defined in `docs/standard/guide_adrs.md`.

## Consequences

### Positive
- All architectural decisions of the tooling are traceable.
- The standard's ADR process gets validated on a real greenfield project.

### Negative
- Discipline is required to create an ADR for every significant decision.

### Risks
- None beyond process overhead.

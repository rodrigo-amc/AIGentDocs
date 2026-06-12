# @aigentdocs/mcp

MCP server for the [AIGentDocs](https://github.com/rodrigo-amc/AIGentDocs) docs-as-code standard: exposes the standard's operations as tools for **any MCP-capable AI agent** (Claude Code, Codex, Antigravity, Copilot, JetBrains, ...).

| Tool | What it does |
|---|---|
| `get_project_status` | Aggregate module states/coverage/debt (authoritative record) |
| `get_active_task` | The board's `[In Progress]` items (or the next one up) |
| `get_module` | Full content of one domain module |
| `start_session` | Loads a documentation session's context + write scope |
| `start_correction_session` | Loads a Correction Record; approved Impact Map = write scope |
| `update_module_state` | Syncs a module's state across the machine-owned places |
| `validate_docs` | Runs the deterministic lint |

## Setup

Run from the root of a repository documented with AIGentDocs. For example, with Claude Code:

```bash
claude mcp add aigentdocs -- npx -y @aigentdocs/mcp
```

Other clients: configure a stdio server with command `npx`, args `-y @aigentdocs/mcp` and the project root as working directory (or pass `--root <path>` / set `AIGENTDOCS_ROOT`).

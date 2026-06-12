#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { buildServer } from "./server.js";

// The documented repository root: --root <path>, AIGENTDOCS_ROOT, or the cwd
// (MCP clients normally launch servers with cwd = the project root).
const rootFlag = process.argv.indexOf("--root");
const repoRoot =
  rootFlag !== -1 && process.argv[rootFlag + 1] !== undefined
    ? (process.argv[rootFlag + 1] as string)
    : (process.env["AIGENTDOCS_ROOT"] ?? process.cwd());

await buildServer(repoRoot).connect(new StdioServerTransport());

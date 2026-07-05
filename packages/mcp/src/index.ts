#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { buildServer } from "./server.js";

// The documented repository root: --root <path>, AIGENTDOCS_ROOT, or the cwd
// (MCP clients normally launch servers with cwd = the project root).
const rootFlag = process.argv.indexOf("--root");
let repoRoot = process.env["AIGENTDOCS_ROOT"] ?? process.cwd();
if (rootFlag !== -1) {
  const value = process.argv[rootFlag + 1];
  if (value === undefined) {
    process.stderr.write("aigentdocs-mcp: --root requires a value\n");
    process.exit(2);
  }
  repoRoot = value;
}

await buildServer(repoRoot).connect(new StdioServerTransport());

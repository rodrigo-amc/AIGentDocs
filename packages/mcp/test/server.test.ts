import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { buildServer } from "../src/server.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const require = createRequire(import.meta.url);
const pkg = require("../../package.json") as { version: string };

interface ToolResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

async function withClient(
  fn: (call: (name: string, args?: Record<string, unknown>) => Promise<ToolResult>) => Promise<void>,
  root: string = REPO_ROOT,
): Promise<void> {
  const server = buildServer(root);
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    await fn(async (name, args = {}) => (await client.callTool({ name, arguments: args })) as ToolResult);
  } finally {
    await client.close();
    await server.close();
  }
}

/**
 * Scaffolded fixture repository (core's makeRepo pattern) with a domain
 * module, a Correction Record, and project_status.yaml — so the tools that
 * this Lite repo cannot exercise get their happy paths tested too.
 */
const FIXTURE_FILES: Record<string, string> = {
  "docs/project/01_product/domain_modules/clients.md":
    "---\ntype: domain_module\nmodule_name: clients\nversion: 1.0\nlast_updated: 2026-07-04\nstate: pending\ncode_paths: []\n---\n\n# Clients\n\n## Description\n\nThe clients module.\n",
  "docs/project/05_corrections/0001-fix-clients.md":
    "---\ntype: correction\nid: 1\nversion: 1.0\nlast_updated: 2026-07-04\nstatus: approved\n---\n\n# Correction 1\n\n## Defect Report\n\nA defect.\n\n## Impact Map\n\n- docs/project/01_product/domain_modules/clients.md\n",
  "docs/project/project_status.yaml": "last_updated: 2026-07-04\nmodules:\n  clients:\n    state: pending\n",
};

async function withFixtureRepo(
  fn: (call: (name: string, args?: Record<string, unknown>) => Promise<ToolResult>, root: string) => Promise<void>,
): Promise<void> {
  const root = await mkdtemp(path.join(os.tmpdir(), "agd-mcp-"));
  try {
    for (const [relPath, content] of Object.entries(FIXTURE_FILES)) {
      const abs = path.join(root, relPath);
      await mkdir(path.dirname(abs), { recursive: true });
      await writeFile(abs, content);
    }
    await withClient(async (call) => fn(call, root), root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("the server lists the seven tools", async () => {
  const server = buildServer(REPO_ROOT);
  const client = new Client({ name: "t", version: "0" });
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(st), client.connect(ct)]);
  const { tools } = await client.listTools();
  assert.deepEqual(
    tools.map((t) => t.name).sort(),
    ["get_active_task", "get_module", "get_project_status", "start_correction_session", "start_session", "update_module_state", "validate_docs"],
  );
  await client.close();
  await server.close();
});

test("validate_docs reports this repo as compliant", async () => {
  await withClient(async (call) => {
    const result = await call("validate_docs");
    assert.notEqual(result.isError, true);
    const parsed = JSON.parse(result.content[0]?.text ?? "{}") as { findings: unknown[]; filesChecked: number };
    assert.deepEqual(parsed.findings, []);
    assert.ok(parsed.filesChecked >= 5);
  });
});

test("get_active_task reads this repo's board", async () => {
  await withClient(async (call) => {
    const result = await call("get_active_task");
    const parsed = JSON.parse(result.content[0]?.text ?? "{}") as { phase: string; active: string[] };
    assert.match(parsed.phase, /Phase/);
    assert.ok(Array.isArray(parsed.active));
  });
});

test("get_project_status falls back to a per-document overview on Lite projects", async () => {
  await withClient(async (call) => {
    const result = await call("get_project_status");
    const parsed = JSON.parse(result.content[0]?.text ?? "{}") as { note?: string; documents?: unknown[] };
    // This repo uses the Lite profile: no project_status.yaml.
    assert.match(parsed.note ?? "", /Lite profile/);
    assert.ok((parsed.documents?.length ?? 0) >= 5);
  });
});

test("start_session loads the agent profile, the guide, and the write scope", async () => {
  await withClient(async (call) => {
    const result = await call("start_session", { type: "02_architecture" });
    const body = result.content[0]?.text ?? "";
    assert.match(body, /WRITE SCOPE: docs\/project\/02_architecture\/ only/);
    assert.match(body, /Senior Solutions Architect/);
    assert.match(body, /Design Docs/);
  });
});

test("the handshake advertises the package.json version, not a hardcoded one", async () => {
  const server = buildServer(REPO_ROOT);
  const client = new Client({ name: "t", version: "0" });
  const [ct, st] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(st), client.connect(ct)]);
  assert.deepEqual(client.getServerVersion(), { name: "aigentdocs", version: pkg.version });
  await client.close();
  await server.close();
});

test("get_module returns the module document on a repo that has one", async () => {
  await withFixtureRepo(async (call) => {
    const result = await call("get_module", { name: "clients" });
    assert.notEqual(result.isError, true);
    assert.match(result.content[0]?.text ?? "", /# Clients/);
    assert.match(result.content[0]?.text ?? "", /module_name: clients/);
  });
});

test("start_correction_session hands out the Impact Map as the write scope when approved", async () => {
  await withFixtureRepo(async (call) => {
    const result = await call("start_correction_session", { id: 1 });
    assert.notEqual(result.isError, true);
    const body = result.content[0]?.text ?? "";
    assert.match(body, /Impact Map below IS your write scope/);
    assert.match(body, /## Impact Map/);
  });
});

test("update_module_state syncs the frontmatter and project_status.yaml through the tool", async () => {
  await withFixtureRepo(async (call, root) => {
    const result = await call("update_module_state", { module: "clients", state: "doing" });
    assert.notEqual(result.isError, true);
    const parsed = JSON.parse(result.content[0]?.text ?? "{}") as { updated: string[]; reminders: string[] };
    assert.deepEqual(parsed.updated.sort(), [
      "docs/project/01_product/domain_modules/clients.md",
      "docs/project/project_status.yaml",
    ]);
    const moduleDoc = await readFile(path.join(root, "docs/project/01_product/domain_modules/clients.md"), "utf8");
    assert.match(moduleDoc, /^state: doing$/m);
    const status = await readFile(path.join(root, "docs/project/project_status.yaml"), "utf8");
    assert.match(status, /state: doing/);
  });
});

test("update_module_state rejects a state outside the standard's allowed values", async () => {
  await withFixtureRepo(async (call) => {
    // Depending on the SDK version this is a schema rejection (throw) or a tool error.
    let rejected = false;
    try {
      const result = await call("update_module_state", { module: "clients", state: "started" });
      rejected = result.isError === true;
    } catch {
      rejected = true;
    }
    assert.ok(rejected, "an invalid state must not be accepted");
  });
});

test("the bin entry errors out when --root has no value", async () => {
  const run = promisify(execFile);
  const bin = path.join(REPO_ROOT, "packages", "mcp", "dist", "src", "index.js");
  await assert.rejects(
    () => run(process.execPath, [bin, "--root"]),
    (error: { code?: number; stderr?: string }) => {
      assert.equal(error.code, 2);
      assert.match(error.stderr ?? "", /--root requires a value/);
      return true;
    },
  );
});

test("get_module reports what exists when the module doesn't", async () => {
  await withClient(async (call) => {
    const result = await call("get_module", { name: "ghost" });
    assert.equal(result.isError, true);
    assert.match(result.content[0]?.text ?? "", /no domain module 'ghost'/);
  });
});

test("start_correction_session refuses unknown records", async () => {
  await withClient(async (call) => {
    const result = await call("start_correction_session", { id: 999 });
    assert.equal(result.isError, true);
    assert.match(result.content[0]?.text ?? "", /no Correction Record with id 999/);
  });
});

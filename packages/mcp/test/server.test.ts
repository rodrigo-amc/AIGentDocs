import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { buildServer } from "../src/server.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");

interface ToolResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

async function withClient(fn: (call: (name: string, args?: Record<string, unknown>) => Promise<ToolResult>) => Promise<void>): Promise<void> {
  const server = buildServer(REPO_ROOT);
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

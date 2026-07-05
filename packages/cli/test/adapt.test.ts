import { test } from "node:test";
import assert from "node:assert/strict";
import { access, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { main, type Io } from "../src/main.js";

/** CLI-level contract of `adapt` (T-08): --tool selection, comma lists, option rejection. */

function capture(): { io: Io; out: () => string; err: () => string } {
  let out = "";
  let err = "";
  return {
    io: { out: (t) => (out += t), err: (t) => (err += t) },
    out: () => out,
    err: () => err,
  };
}

const exists = (p: string): Promise<boolean> => access(p).then(() => true, () => false);

async function withAgentsMd(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-cli-adapt-"));
  try {
    await writeFile(path.join(dir, "AGENTS.md"), "# Agents\n");
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("adapt --tool generates exactly the requested adapter", async () => {
  await withAgentsMd(async (dir) => {
    const c = capture();
    assert.equal(await main(["adapt", dir, "--tool", "claude"], c.io), 0);
    assert.match(c.out(), /1 adapter\(s\) written/);
    assert.ok(await exists(path.join(dir, "CLAUDE.md")));
    assert.equal(await exists(path.join(dir, "GEMINI.md")), false, "unrequested adapters must not be written");
  });
});

test("adapt --tool accepts a comma-separated list", async () => {
  await withAgentsMd(async (dir) => {
    const c = capture();
    assert.equal(await main(["adapt", dir, "--tool", "claude,cursor"], c.io), 0);
    assert.match(c.out(), /2 adapter\(s\) written/);
    assert.ok(await exists(path.join(dir, "CLAUDE.md")));
    assert.ok(await exists(path.join(dir, ".cursor/rules/aigentdocs.mdc")));
  });
});

test("adapt --tool without a value exits 2", async () => {
  await withAgentsMd(async (dir) => {
    const c = capture();
    assert.equal(await main(["adapt", dir, "--tool"], c.io), 2);
    assert.match(c.err(), /--tool requires a value/);
  });
});

test("adapt rejects unknown options and unknown tools with exit 2", async () => {
  await withAgentsMd(async (dir) => {
    const unknownOption = capture();
    assert.equal(await main(["adapt", dir, "--frobnicate"], unknownOption.io), 2);
    assert.match(unknownOption.err(), /unknown adapt option '--frobnicate'/);

    const unknownTool = capture();
    assert.equal(await main(["adapt", dir, "--tool", "emacs"], unknownTool.io), 2);
    assert.match(unknownTool.err(), /unknown tool 'emacs'/);
  });
});

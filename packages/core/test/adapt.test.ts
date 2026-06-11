import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { ADAPTER_TARGETS, GENERATION_MARKER, adaptProject } from "../src/index.js";

async function inRepo(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-adapt-"));
  try {
    await writeFile(path.join(dir, "AGENTS.md"), "# Agent instructions\n");
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("adapt generates all registered adapters, each carrying the marker", async () => {
  await inRepo(async (dir) => {
    const result = await adaptProject(dir);
    assert.equal(result.written.length, Object.keys(ADAPTER_TARGETS).length);
    assert.equal(result.skipped.length, 0);
    for (const target of Object.values(ADAPTER_TARGETS)) {
      const content = await readFile(path.join(dir, target.file), "utf8");
      assert.ok(content.includes(GENERATION_MARKER), `${target.file} must carry the generation marker`);
      assert.match(content, /AGENTS\.md/);
    }
  });
});

test("adapt regenerates its own files but never touches hand-edited ones", async () => {
  await inRepo(async (dir) => {
    await adaptProject(dir, ["claude"]);
    // Regenerating a generated file is fine.
    const again = await adaptProject(dir, ["claude"]);
    assert.equal(again.written.length, 1);

    // A hand-edited file (no marker) is left untouched.
    await writeFile(path.join(dir, "CLAUDE.md"), "# my own claude config\n");
    const third = await adaptProject(dir, ["claude"]);
    assert.equal(third.written.length, 0);
    assert.equal(third.skipped.length, 1);
    assert.match(third.skipped[0]?.reason ?? "", /left untouched/);
    assert.equal(await readFile(path.join(dir, "CLAUDE.md"), "utf8"), "# my own claude config\n");
  });
});

test("adapt with a tool subset only generates those files", async () => {
  await inRepo(async (dir) => {
    const result = await adaptProject(dir, ["cursor", "antigravity"]);
    assert.deepEqual(result.written.map((w) => w.file).sort(), [".cursor/rules/aigenticdocs.mdc", "GEMINI.md"]);
  });
});

test("adapt rejects unknown tools and missing AGENTS.md", async () => {
  await inRepo(async (dir) => {
    await assert.rejects(() => adaptProject(dir, ["emacs"]), /unknown tool 'emacs'/);
  });
  const empty = await mkdtemp(path.join(os.tmpdir(), "agd-adapt-empty-"));
  try {
    await assert.rejects(() => adaptProject(empty), /'AGENTS\.md' not found/);
  } finally {
    await rm(empty, { recursive: true, force: true });
  }
});

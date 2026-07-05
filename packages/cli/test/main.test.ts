import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { main, type Io } from "../src/main.js";

function capture(): { io: Io; out: () => string; err: () => string } {
  let out = "";
  let err = "";
  return {
    io: { out: (t) => (out += t), err: (t) => (err += t) },
    out: () => out,
    err: () => err,
  };
}

test("no arguments prints help and exits 0", async () => {
  const c = capture();
  assert.equal(await main([], c.io), 0);
  assert.match(c.out(), /Usage: aigentdocs <command>/);
});

test("--version prints a semver-looking version and exits 0", async () => {
  const c = capture();
  assert.equal(await main(["--version"], c.io), 0);
  assert.match(c.out(), /^\d+\.\d+\.\d+/);
});

test("unknown command reports an error and exits 2, like every other usage error", async () => {
  const c = capture();
  assert.equal(await main(["frobnicate"], c.io), 2);
  assert.match(c.err(), /unknown or not yet implemented command 'frobnicate'/);
  assert.equal(c.out(), "");
});

test("lint on this repository exits 0 and reports files checked", async () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
  const c = capture();
  assert.equal(await main(["lint", repoRoot], c.io), 0);
  assert.match(c.out(), /No findings\. \d+ file\(s\) checked: 0 critical/);
});

test("lint with warnings but no criticals exits 0 (only criticals block)", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-warnings-"));
  try {
    // A valid roadmap whose only defect is an unresolved '(see X.md)' reference — a warning.
    const roadmapPath = path.join(dir, "docs", "project", "01_product", "roadmap.md");
    await mkdir(path.dirname(roadmapPath), { recursive: true });
    await writeFile(
      roadmapPath,
      "---\ntype: roadmap\nversion: 1.0\nlast_updated: 2026-07-04\ncurrent_phase: MVP\n---\n\n## Current Phase/Milestone\n\nMVP.\n\n## Task Board\n\n- [T-1] Ghost task (see ghost.md)\n",
    );
    const c = capture();
    assert.equal(await main(["lint", dir], c.io), 0);
    assert.match(c.out(), /0 critical, 1 warning/);
    assert.match(c.out(), /ref\/roadmap-reference/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("lint outside a documented repository exits 2 with a clear error", async () => {
  const c = capture();
  assert.equal(await main(["lint", "/tmp"], c.io), 2);
  assert.match(c.err(), /not found — is this an AIGentDocs repository\?/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

import { parseYaml } from "@aigentdocs/core";

import { main, type Io } from "../src/main.js";

const require = createRequire(import.meta.url);

function capture(): { io: Io; out: () => string; err: () => string } {
  let out = "";
  let err = "";
  return {
    io: { out: (t) => (out += t), err: (t) => (err += t) },
    out: () => out,
    err: () => err,
  };
}

test("the standard package version mirrors changelog.yaml (ADR-0004 compliance)", async () => {
  const pkgPath = require.resolve("@aigentdocs/standard/package.json");
  const pkg = require("@aigentdocs/standard/package.json") as { version: string };
  const changelog = parseYaml(await readFile(path.join(path.dirname(pkgPath), "standard", "changelog.yaml"), "utf8")) as Array<{ version: string }>;
  assert.equal(pkg.version, changelog[0]?.version);
});

test("init + lint end to end: full profile scaffolds and lints clean", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-cli-init-"));
  try {
    const c = capture();
    assert.equal(await main(["init", dir], c.io), 0);
    assert.match(c.out(), /Initialized AIGentDocs \(full profile\)/);
    assert.match(c.out(), /\+ docs\/standard\//);

    const lint = capture();
    assert.equal(await main(["lint", dir], lint.io), 0);
    assert.match(lint.out(), /0 critical/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("init --lite then lint surfaces the documentation to-do list", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-cli-lite-"));
  try {
    const c = capture();
    assert.equal(await main(["init", dir, "--lite"], c.io), 0);
    assert.match(c.out(), /lite profile/);
    assert.match(c.out(), /to-do list/);

    const lint = capture();
    assert.equal(await main(["lint", dir], lint.io), 1);
    assert.match(lint.out(), /section\/empty/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("init rejects unknown flags", async () => {
  const c = capture();
  assert.equal(await main(["init", "--frobnicate"], c.io), 2);
  assert.match(c.err(), /unknown init option/);
});

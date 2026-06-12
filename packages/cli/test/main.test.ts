import { test } from "node:test";
import assert from "node:assert/strict";
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

test("unknown command reports an error and exits 1", async () => {
  const c = capture();
  assert.equal(await main(["frobnicate"], c.io), 1);
  assert.match(c.err(), /unknown or not yet implemented command 'frobnicate'/);
  assert.equal(c.out(), "");
});

test("lint on this repository exits 0 and reports files checked", async () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
  const c = capture();
  assert.equal(await main(["lint", repoRoot], c.io), 0);
  assert.match(c.out(), /No findings\. \d+ file\(s\) checked: 0 critical/);
});

test("lint outside a documented repository exits 2 with a clear error", async () => {
  const c = capture();
  assert.equal(await main(["lint", "/tmp"], c.io), 2);
  assert.match(c.err(), /not found — is this an AIGentDocs repository\?/);
});

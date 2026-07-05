import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { main, type Io } from "../src/main.js";

/**
 * CLI-level contract of `update` (T-11): exit 0 when up to date or after
 * applying, 1 when --check finds an available update (the CI contract),
 * 2 when the installed standard is ahead of the CLI's.
 */

function capture(): { io: Io; out: () => string; err: () => string } {
  let out = "";
  let err = "";
  return {
    io: { out: (t) => (out += t), err: (t) => (err += t) },
    out: () => out,
    err: () => err,
  };
}

const OLD_CHANGELOG = `- version: "1.3.0"\n  date: "2026-03-21"\n  summary: "old"\n`;

async function withAdopter(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-cli-update-"));
  try {
    assert.equal(await main(["init", dir], capture().io), 0);
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("update on a fresh init exits 0 (up to date)", async () => {
  await withAdopter(async (dir) => {
    const c = capture();
    assert.equal(await main(["update", dir], c.io), 0);
    assert.match(c.out(), /up to date/);
  });
});

test("update --check exits 1 when outdated; applying the update exits 0", async () => {
  await withAdopter(async (dir) => {
    const changelogPath = path.join(dir, "docs", "standard", "changelog.yaml");
    await writeFile(changelogPath, OLD_CHANGELOG);

    const check = capture();
    assert.equal(await main(["update", dir, "--check"], check.io), 1, "--check on an outdated standard is the CI failure signal");
    assert.match(check.out(), /Update available: 1\.3\.0 ->/);

    const apply = capture();
    assert.equal(await main(["update", dir], apply.io), 0, "applying the update succeeds");
    assert.match(apply.out(), /Updated 1\.3\.0 ->/);

    assert.equal(await main(["update", dir, "--check"], capture().io), 0, "--check right after updating is clean");
  });
});

test("update exits 2 when the installed standard is ahead of the CLI's", async () => {
  await withAdopter(async (dir) => {
    await writeFile(path.join(dir, "docs", "standard", "changelog.yaml"), `- version: "99.0.0"\n  summary: "future"\n`);
    const c = capture();
    assert.equal(await main(["update", dir], c.io), 2);
    assert.match(c.err(), /Update the CLI instead: npm install -D aigentdocs@latest/);
  });
});

test("unknown update option exits 2", async () => {
  await withAdopter(async (dir) => {
    const c = capture();
    assert.equal(await main(["update", dir, "--force"], c.io), 2);
    assert.match(c.err(), /unknown update option '--force'/);
  });
});

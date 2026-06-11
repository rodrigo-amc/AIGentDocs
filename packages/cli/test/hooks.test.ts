import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

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

async function inGitRepo(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-hooks-"));
  try {
    await mkdir(path.join(dir, ".git"), { recursive: true });
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("hooks install writes an executable pre-commit hook with the conscious bypass", async () => {
  await inGitRepo(async (dir) => {
    const c = capture();
    assert.equal(await main(["hooks", "install", dir], c.io), 0);
    const hookPath = path.join(dir, ".git", "hooks", "pre-commit");
    const content = await readFile(hookPath, "utf8");
    assert.match(content, /^#!\/bin\/sh/);
    assert.match(content, /aigenticdocs lint/);
    assert.match(content, /git commit --no-verify/);
    const mode = (await stat(hookPath)).mode & 0o777;
    assert.ok(mode & 0o100, "hook must be executable");
    assert.match(c.out(), /--no-verify/);
  });
});

test("hooks install refuses to overwrite an existing hook", async () => {
  await inGitRepo(async (dir) => {
    assert.equal(await main(["hooks", "install", dir], capture().io), 0);
    const c = capture();
    assert.equal(await main(["hooks", "install", dir], c.io), 2);
    assert.match(c.err(), /refusing to overwrite/);
  });
});

test("hooks install outside a git repository fails clearly", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-nogit-"));
  try {
    const c = capture();
    assert.equal(await main(["hooks", "install", dir], c.io), 2);
    assert.match(c.err(), /not a git repository/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("unknown hooks subcommand fails with guidance", async () => {
  const c = capture();
  assert.equal(await main(["hooks", "uninstall"], c.io), 2);
  assert.match(c.err(), /Did you mean 'hooks install'\?/);
});

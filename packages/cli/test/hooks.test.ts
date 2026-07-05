import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { main, type Io } from "../src/main.js";

const run = promisify(execFile);

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
    assert.match(content, /aigentdocs lint/);
    assert.match(content, /git commit --no-verify/);
    assert.match(content, /node_modules\/\.bin\/aigentdocs/, "the hook must resolve the CLI locally, not via npx");
    const mode = (await stat(hookPath)).mode & 0o777;
    assert.ok(mode & 0o100, "hook must be executable");
    assert.match(c.out(), /--no-verify/);
  });
});

test("the installed hook lets the commit through when the CLI is not installed locally", async () => {
  await inGitRepo(async (dir) => {
    assert.equal(await main(["hooks", "install", dir], capture().io), 0);
    // No node_modules in this repo: the hook must inform and exit 0, not block.
    const { stdout } = await run("sh", [path.join(dir, ".git", "hooks", "pre-commit")], { cwd: dir });
    assert.match(stdout, /skipping the documentation check/);
    assert.match(stdout, /npm install -D aigentdocs/);
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

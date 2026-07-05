import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

/**
 * Behavior tests for the Claude Code plugin's Stop hook (stop-lint.sh),
 * with a stubbed CLI: off-switch, undocumented project, missing CLI,
 * critical findings, and clean lint.
 */

const run = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCRIPT = path.join(REPO_ROOT, "plugins", "claude", "scripts", "stop-lint.sh");

interface HookResult {
  code: number;
  stdout: string;
  stderr: string;
}

async function runHook(cwd: string, env: Record<string, string> = {}): Promise<HookResult> {
  try {
    const { stdout, stderr } = await run("sh", [SCRIPT], { cwd, env: { ...process.env, AIGENTDOCS_STOP_LINT: "", ...env } });
    return { code: 0, stdout, stderr };
  } catch (error) {
    const failed = error as { code?: number; stdout?: string; stderr?: string };
    return { code: failed.code ?? -1, stdout: failed.stdout ?? "", stderr: failed.stderr ?? "" };
  }
}

async function makeProject(options: { documented?: boolean; cli?: { exitCode: number; output: string } } = {}): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-stop-"));
  if (options.documented !== false) {
    await mkdir(path.join(dir, "docs", "project"), { recursive: true });
  }
  if (options.cli !== undefined) {
    const binDir = path.join(dir, "node_modules", ".bin");
    await mkdir(binDir, { recursive: true });
    await writeFile(
      path.join(binDir, "aigentdocs"),
      `#!/bin/sh\nif [ -n "${options.cli.output}" ]; then echo "${options.cli.output}"; fi\nexit ${options.cli.exitCode}\n`,
      { mode: 0o755 },
    );
  }
  return dir;
}

async function withProject(options: Parameters<typeof makeProject>[0], fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await makeProject(options);
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("AIGENTDOCS_STOP_LINT=off disables the hook even with critical findings", async () => {
  await withProject({ cli: { exitCode: 1, output: "critical finding" } }, async (dir) => {
    const result = await runHook(dir, { AIGENTDOCS_STOP_LINT: "off" });
    assert.equal(result.code, 0);
    assert.equal(result.stderr, "");
  });
});

test("a project without docs/project/ stays silent", async () => {
  await withProject({ documented: false, cli: { exitCode: 1, output: "critical finding" } }, async (dir) => {
    const result = await runHook(dir);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, "");
  });
});

test("a documented project without a locally installed CLI stays silent", async () => {
  // The 2026-07-04 review finding: this used to fire a false positive on every Stop.
  await withProject({}, async (dir) => {
    const result = await runHook(dir);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, "");
  });
});

test("critical findings exit 2 and feed the lint output back", async () => {
  await withProject({ cli: { exitCode: 1, output: "roadmap.md: missing frontmatter" } }, async (dir) => {
    const result = await runHook(dir);
    assert.equal(result.code, 2);
    assert.match(result.stderr, /critical documentation findings/);
    assert.match(result.stderr, /roadmap\.md: missing frontmatter/);
    assert.match(result.stderr, /Anti-Drift Protocol/);
  });
});

test("a lint exit 1 with no output is not reported as findings", async () => {
  await withProject({ cli: { exitCode: 1, output: "" } }, async (dir) => {
    const result = await runHook(dir);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, "");
  });
});

test("a clean lint stays silent", async () => {
  await withProject({ cli: { exitCode: 0, output: "No findings." } }, async (dir) => {
    const result = await runHook(dir);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, "");
  });
});

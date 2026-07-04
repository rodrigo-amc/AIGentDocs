import { test } from "node:test";
import assert from "node:assert/strict";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { initProject, lintProject } from "../src/index.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const STANDARD_DIR = path.join(REPO_ROOT, "docs", "standard");

const exists = (p: string): Promise<boolean> => access(p).then(() => true, () => false);

async function inTmp(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-init-"));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("full init scaffolds the structure, status artifacts, and AGENTS.md", async () => {
  await inTmp(async (dir) => {
    const result = await initProject(dir, STANDARD_DIR, "full");
    assert.equal(result.profile, "full");
    for (const expected of [
      "docs/standard/PROTOCOL.md",
      "docs/project/01_product/domain_modules",
      "docs/project/05_corrections",
      "docs/project/project_status.yaml",
      "docs/project/TODO.md",
      "AGENTS.md",
    ]) {
      assert.ok(await exists(path.join(dir, expected)), `missing ${expected}`);
    }
    const status = await readFile(path.join(dir, "docs/project/project_status.yaml"), "utf8");
    assert.doesNotMatch(status, /YYYY-MM-DD/, "dates must be stamped");
  });
});

test("a full init lints clean from the start", async () => {
  await inTmp(async (dir) => {
    await initProject(dir, STANDARD_DIR, "full");
    const { findings } = await lintProject(dir);
    assert.deepEqual(findings, []);
  });
});

test("lite init creates exactly the three Lite files", async () => {
  await inTmp(async (dir) => {
    await initProject(dir, STANDARD_DIR, "lite");
    assert.ok(await exists(path.join(dir, "docs/project/01_product/vision.md")));
    assert.ok(await exists(path.join(dir, "docs/project/01_product/roadmap.md")));
    assert.ok(await exists(path.join(dir, "docs/project/03_engineering/tech_stack.yaml")));
    assert.equal(await exists(path.join(dir, "docs/project/project_status.yaml")), false);
    assert.equal(await exists(path.join(dir, "docs/project/04_adrs")), false);
  });
});

test("after a lite init, lint reports the empty sections as the to-do list", async () => {
  await inTmp(async (dir) => {
    await initProject(dir, STANDARD_DIR, "lite");
    const { findings } = await lintProject(dir);
    assert.ok(findings.some((f) => f.rule === "section/empty"), "expected empty-section findings");
    const allowed = (rule: string): boolean => rule.startsWith("section/") || rule === "ref/tech-stack-adr-empty";
    assert.ok(findings.every((f) => allowed(f.rule)), `unexpected rules: ${findings.map((f) => f.rule).join(", ")}`);
  });
});

test("init refuses to overwrite an existing docs/ directory", async () => {
  await inTmp(async (dir) => {
    await initProject(dir, STANDARD_DIR, "full");
    await assert.rejects(() => initProject(dir, STANDARD_DIR, "full"), /refusing to overwrite/);
  });
});

test("init leaves an existing AGENTS.md untouched", async () => {
  await inTmp(async (dir) => {
    await writeFile(path.join(dir, "AGENTS.md"), "mine\n");
    const result = await initProject(dir, STANDARD_DIR, "full");
    assert.equal(await readFile(path.join(dir, "AGENTS.md"), "utf8"), "mine\n");
    assert.ok(result.created.some((c) => c.includes("left untouched")));
  });
});

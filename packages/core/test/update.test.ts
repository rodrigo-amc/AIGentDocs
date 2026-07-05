import { test } from "node:test";
import assert from "node:assert/strict";
import { access, chmod, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { compareVersions, initProject, updateStandard } from "../src/index.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const STANDARD_DIR = path.join(REPO_ROOT, "docs", "standard");

const OLD_CHANGELOG = `- version: "1.3.0"\n  date: "2026-03-21"\n  summary: "old"\n`;

const exists = (p: string): Promise<boolean> => access(p).then(() => true, () => false);

async function withAdopter(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-update-"));
  try {
    await initProject(dir, STANDARD_DIR, "full");
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("compareVersions handles dotted versions of different lengths", () => {
  assert.equal(compareVersions("1.4.3", "1.4.3"), 0);
  assert.equal(compareVersions("1.4", "1.4.0"), 0);
  assert.equal(compareVersions("1.3.0", "1.4.3"), -1);
  assert.equal(compareVersions("2.0", "1.9.9"), 1);
});

test("compareVersions rejects non-numeric versions instead of guessing", () => {
  assert.throws(() => compareVersions("1.4.x", "1.4.3"), /invalid version '1\.4\.x'/);
  assert.throws(() => compareVersions("1.4.3", "1.4.x"), /invalid version '1\.4\.x'/);
  assert.throws(() => compareVersions("", "1.0"), /invalid version ''/);
});

test("a malformed adopter changelog version yields a clear error, not a nonsense status", async () => {
  await withAdopter(async (dir) => {
    await writeFile(path.join(dir, "docs/standard/changelog.yaml"), `- version: "1.4.x"\n  summary: "typo"\n`);
    await assert.rejects(() => updateStandard(dir, STANDARD_DIR), /invalid version '1\.4\.x'/);
  });
});

test("a fresh init is up to date", async () => {
  await withAdopter(async (dir) => {
    const result = await updateStandard(dir, STANDARD_DIR);
    assert.equal(result.status, "up-to-date");
  });
});

test("an outdated standard is updated with migration notes; uncustomized README is replaced", async () => {
  await withAdopter(async (dir) => {
    await writeFile(path.join(dir, "docs/standard/changelog.yaml"), OLD_CHANGELOG);
    const result = await updateStandard(dir, STANDARD_DIR);
    assert.equal(result.status, "updated");
    assert.equal(result.from, "1.3.0");
    assert.ok(result.notes.length >= 4, "expected the 1.4.x entries as migration notes");
    assert.equal(await exists(path.join(dir, "docs/standard/README.md.new")), false);
    // The changelog is the new one again.
    const changelog = await readFile(path.join(dir, "docs/standard/changelog.yaml"), "utf8");
    assert.doesNotMatch(changelog, /^- version: "1\.3\.0"/);
  });
});

test("docs/standard is replaced wholesale — local edits to it do not survive", async () => {
  await withAdopter(async (dir) => {
    await writeFile(path.join(dir, "docs/standard/changelog.yaml"), OLD_CHANGELOG);
    await writeFile(path.join(dir, "docs/standard/README.md"), "# edited in place\n");
    const result = await updateStandard(dir, STANDARD_DIR);
    assert.equal(result.status, "updated");
    // The standard's own README is restored; the local edit is gone, no .new file.
    const readme = await readFile(path.join(dir, "docs/standard/README.md"), "utf8");
    assert.doesNotMatch(readme, /edited in place/);
    assert.equal(await exists(path.join(dir, "docs/standard/README.md.new")), false);
  });
});

test("--check reports without modifying anything", async () => {
  await withAdopter(async (dir) => {
    await writeFile(path.join(dir, "docs/standard/changelog.yaml"), OLD_CHANGELOG);
    const result = await updateStandard(dir, STANDARD_DIR, { check: true });
    assert.equal(result.status, "would-update");
    const changelog = await readFile(path.join(dir, "docs/standard/changelog.yaml"), "utf8");
    assert.equal(changelog, OLD_CHANGELOG, "check must not touch the adopter");
  });
});

test("a successful update leaves no staging directory behind", async () => {
  await withAdopter(async (dir) => {
    await writeFile(path.join(dir, "docs/standard/changelog.yaml"), OLD_CHANGELOG);
    const result = await updateStandard(dir, STANDARD_DIR);
    assert.equal(result.status, "updated");
    const leftovers = (await readdir(path.join(dir, "docs"))).filter((entry) => entry.includes("staging"));
    assert.deepEqual(leftovers, []);
  });
});

test("a failed update never leaves the adopter without docs/standard/", { skip: process.getuid?.() === 0 }, async () => {
  await withAdopter(async (dir) => {
    await writeFile(path.join(dir, "docs/standard/changelog.yaml"), OLD_CHANGELOG);
    // Make docs/ read-only so the staged copy cannot even be created.
    const docsDir = path.join(dir, "docs");
    await chmod(docsDir, 0o555);
    try {
      await assert.rejects(() => updateStandard(dir, STANDARD_DIR));
    } finally {
      await chmod(docsDir, 0o755);
    }
    assert.ok(await exists(path.join(dir, "docs/standard/README.md")), "the installed standard must survive the failure");
    const changelog = await readFile(path.join(dir, "docs/standard/changelog.yaml"), "utf8");
    assert.equal(changelog, OLD_CHANGELOG, "the installed standard must be intact");
  });
});

test("an installed standard newer than the CLI's reports 'ahead'", async () => {
  await withAdopter(async (dir) => {
    await writeFile(path.join(dir, "docs/standard/changelog.yaml"), `- version: "99.0.0"\n  summary: "future"\n`);
    const result = await updateStandard(dir, STANDARD_DIR);
    assert.equal(result.status, "ahead");
  });
});

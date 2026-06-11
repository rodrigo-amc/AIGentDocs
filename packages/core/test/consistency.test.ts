import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { lintProject } from "../src/index.js";

/** Create a throwaway repository with the given files (paths relative to its root). */
async function makeRepo(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "agd-test-"));
  for (const [relPath, content] of Object.entries(files)) {
    const abs = path.join(root, relPath);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, content);
  }
  return root;
}

const fm = (body: string): string => `---\n${body}\n---\n\n# Doc\n`;
const COMMON = "version: 1.0\nlast_updated: 2026-06-11";

async function rulesOf(files: Record<string, string>): Promise<string[]> {
  const root = await makeRepo(files);
  try {
    const { findings } = await lintProject(root);
    return findings.map((f) => f.rule);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("tech_stack ADR reference to a missing file is critical; empty is a suggestion", async () => {
  const rules = await rulesOf({
    "docs/project/03_engineering/tech_stack.yaml":
      "backend:\n  language:\n    name: Go\n    version: '1.22'\n    adr: '0009-ghost.md'\n  framework:\n    name: none\n    version: ''\n    adr: ''\n",
  });
  assert.ok(rules.includes("ref/tech-stack-adr"));
  assert.ok(rules.includes("ref/tech-stack-adr-empty"));
});

test("ADR supersedes/superseded_by reciprocity is enforced", async () => {
  const broken = await rulesOf({
    "docs/project/04_adrs/0001-a.md": fm(`type: adr\n${COMMON}\nid: 1\nstatus: accepted\ndate: 2026-06-11`),
    "docs/project/04_adrs/0002-b.md": fm(`type: adr\n${COMMON}\nid: 2\nstatus: accepted\ndate: 2026-06-11\nsupersedes: 1`),
  });
  assert.ok(broken.includes("adr/supersedes-reciprocity"));

  const fixed = await rulesOf({
    "docs/project/04_adrs/0001-a.md": fm(`type: adr\n${COMMON}\nid: 1\nstatus: superseded\ndate: 2026-06-11\nsuperseded_by: 2`),
    "docs/project/04_adrs/0002-b.md": fm(`type: adr\n${COMMON}\nid: 2\nstatus: accepted\ndate: 2026-06-11\nsupersedes: 1`),
  });
  assert.deepEqual(fixed, []);
});

test("supersedes pointing to a nonexistent ADR is critical", async () => {
  const rules = await rulesOf({
    "docs/project/04_adrs/0002-b.md": fm(`type: adr\n${COMMON}\nid: 2\nstatus: accepted\ndate: 2026-06-11\nsupersedes: 9`),
  });
  assert.ok(rules.includes("ref/adr-supersedes-target"));
});

test("superseded_by without superseded status is a warning", async () => {
  const rules = await rulesOf({
    "docs/project/04_adrs/0001-a.md": fm(`type: adr\n${COMMON}\nid: 1\nstatus: accepted\ndate: 2026-06-11\nsuperseded_by: 2`),
    "docs/project/04_adrs/0002-b.md": fm(`type: adr\n${COMMON}\nid: 2\nstatus: accepted\ndate: 2026-06-11\nsupersedes: 1`),
  });
  assert.ok(rules.includes("adr/superseded-status"));
});

test("code_paths pointing nowhere is a warning; existing paths pass", async () => {
  const moduleDoc = fm(`type: domain_module\nmodule_name: clients\n${COMMON}\nstate: pending\ncode_paths: ["/src/clients/", "/src/ghost/"]`);
  const root = await makeRepo({
    "docs/project/01_product/domain_modules/clients.md": moduleDoc,
    "src/clients/.keep": "",
  });
  try {
    const { findings } = await lintProject(root);
    const codePathFindings = findings.filter((f) => f.rule === "ref/code-paths");
    assert.equal(codePathFindings.length, 1);
    assert.match(codePathFindings[0]?.message ?? "", /\/src\/ghost\//);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("roadmap '(see X.md)' references must resolve", async () => {
  const rules = await rulesOf({
    "docs/project/01_product/roadmap.md": fm(`type: roadmap\n${COMMON}\ncurrent_phase: MVP`) + "\n- [US-01] Login (see clients.md)\n- [US-02] Ghost (ver stock.md)\n",
    "docs/project/01_product/domain_modules/clients.md": fm(`type: domain_module\nmodule_name: clients\n${COMMON}\nstate: pending\ncode_paths: []`),
  });
  assert.deepEqual(rules.filter((r) => r === "ref/roadmap-reference").length, 1);
});

test("project_status.yaml is authoritative over module frontmatter state", async () => {
  const rules = await rulesOf({
    "docs/project/project_status.yaml": "last_updated: 2026-06-11\nmodules:\n  clients:\n    state: done\n  ghost:\n    state: pending\n  broken:\n    state: started\n",
    "docs/project/01_product/domain_modules/clients.md": fm(`type: domain_module\nmodule_name: clients\n${COMMON}\nstate: doing\ncode_paths: []`),
    "docs/project/01_product/domain_modules/orphan.md": fm(`type: domain_module\nmodule_name: orphan\n${COMMON}\nstate: pending\ncode_paths: []`),
  });
  assert.ok(rules.includes("status/module-state-sync"), "contradiction must be critical");
  assert.ok(rules.includes("status/unknown-module"), "status entry without module doc");
  assert.ok(rules.includes("status/state-value"), "invalid state value in status file");
  assert.ok(rules.includes("status/module-missing"), "module doc not registered in status file");
});

test("unparseable tech_stack.yaml is critical", async () => {
  const rules = await rulesOf({
    "docs/project/03_engineering/tech_stack.yaml": "backend: [unclosed\n",
  });
  assert.ok(rules.includes("yaml/invalid"));
});

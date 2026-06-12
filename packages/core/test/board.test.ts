import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { parseTaskBoard, updateModuleState } from "../src/index.js";

test("parseTaskBoard extracts sections and items", () => {
  const sections = parseTaskBoard(
    "## Task Board\n\n### [In Progress]\n\n- [T-1] thing\n\n### [To Do / Next]\n\n- [T-2] next thing\n- [T-3] later\n\n### [Done]\n\n## Other heading\n\n- not a board item\n",
  );
  assert.deepEqual(
    sections.map((s) => [s.name, s.items.length]),
    [["[In Progress]", 1], ["[To Do / Next]", 2], ["[Done]", 0]],
  );
  assert.match(sections[1]?.items[0] ?? "", /T-2/);
});

test("updateModuleState syncs frontmatter and project_status.yaml, preserving comments", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-state-"));
  try {
    const modulePath = path.join(dir, "docs/project/01_product/domain_modules/clients.md");
    await mkdir(path.dirname(modulePath), { recursive: true });
    await writeFile(
      modulePath,
      "---\ntype: domain_module\nmodule_name: clients\nversion: 1.0\nlast_updated: 2026-06-12\nstate: pending\ncode_paths: []\n---\n\n# Clients\n",
    );
    await writeFile(
      path.join(dir, "docs/project/project_status.yaml"),
      "# Aggregate state — keep this comment\nlast_updated: 2026-06-12\nmodules:\n  clients:\n    state: pending\n",
    );

    const result = await updateModuleState(dir, "clients", "doing");
    assert.deepEqual(result.updated.sort(), ["docs/project/01_product/domain_modules/clients.md", "docs/project/project_status.yaml"]);

    const moduleContent = await readFile(modulePath, "utf8");
    assert.match(moduleContent, /^state: doing$/m);

    const status = await readFile(path.join(dir, "docs/project/project_status.yaml"), "utf8");
    assert.match(status, /state: doing/);
    assert.match(status, /keep this comment/, "comments must survive the edit");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("updateModuleState rejects unknown modules and invalid states", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "agd-state2-"));
  try {
    await mkdir(path.join(dir, "docs/project"), { recursive: true });
    await assert.rejects(() => updateModuleState(dir, "ghost", "doing"), /no domain module named 'ghost'/);
    await assert.rejects(() => updateModuleState(dir, "ghost", "started" as never), /invalid state/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

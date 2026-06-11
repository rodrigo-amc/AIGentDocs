import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { lintMarkdown, lintProject } from "../src/index.js";

const doc = (frontmatter: string): string => `---\n${frontmatter}\n---\n\n# Body\n`;

function rules(content: string): string[] {
  return lintMarkdown("test.md", content).map((f) => f.rule);
}

test("missing frontmatter block is critical", () => {
  const findings = lintMarkdown("test.md", "# No frontmatter\n");
  assert.deepEqual(findings.map((f) => [f.rule, f.severity]), [["frontmatter/missing", "critical"]]);
});

test("unparseable frontmatter is critical", () => {
  assert.deepEqual(rules(doc("type: [broken")), ["frontmatter/invalid-yaml"]);
});

test("missing common fields are reported individually", () => {
  const findings = lintMarkdown("test.md", doc("type: roadmap"));
  const missing = findings.filter((f) => f.rule === "frontmatter/required-fields");
  assert.equal(missing.length, 2); // version, last_updated
});

test("invalid last_updated date is critical", () => {
  assert.ok(rules(doc("type: roadmap\nversion: 1.0\nlast_updated: 2026-13-45")).includes("frontmatter/date-format"));
  assert.ok(rules(doc("type: roadmap\nversion: 1.0\nlast_updated: junio 11")).includes("frontmatter/date-format"));
});

test("a clean roadmap document has no findings", () => {
  assert.deepEqual(rules(doc("type: roadmap\nversion: 1.0\nlast_updated: 2026-06-11\ncurrent_phase: MVP")), []);
});

test("unknown document type is a warning", () => {
  const findings = lintMarkdown("test.md", doc("type: banana\nversion: 1.0\nlast_updated: 2026-06-11"));
  assert.deepEqual(findings.map((f) => [f.rule, f.severity]), [["frontmatter/unknown-type", "warning"]]);
});

test("state-bearing types: missing state warns, invalid state is critical", () => {
  const base = "type: system_overview\nversion: 1.0\nlast_updated: 2026-06-11";
  assert.ok(rules(doc(base)).includes("frontmatter/state-missing"));
  assert.ok(rules(doc(`${base}\nstate: in-progress`)).includes("frontmatter/state-value"));
  assert.deepEqual(rules(doc(`${base}\nstate: doing`)), []);
});

test("ADR status is validated against the allowed values", () => {
  const base = "type: adr\nversion: 1.0\nlast_updated: 2026-06-11\nid: 7\ndate: 2026-06-11";
  assert.ok(rules(doc(`${base}\nstatus: pending`)).includes("frontmatter/adr-status"));
  assert.deepEqual(rules(doc(`${base}\nstatus: accepted`)), []);
});

test("correction status is validated against the allowed values", () => {
  const base = "type: correction\nversion: 1.0\nlast_updated: 2026-06-11";
  assert.ok(rules(doc(`${base}\nstatus: accepted`)).includes("frontmatter/correction-status"));
  assert.deepEqual(rules(doc(`${base}\nstatus: approved`)), []);
});

test("domain modules must carry code_paths as an array", () => {
  const base = "type: domain_module\nversion: 1.0\nlast_updated: 2026-06-11\nstate: pending";
  assert.ok(rules(doc(base)).includes("frontmatter/code-paths"));
  assert.ok(rules(doc(`${base}\ncode_paths: src/`)).includes("frontmatter/code-paths"));
  assert.deepEqual(rules(doc(`${base}\ncode_paths: ["src/"]`)), []);
});

test("dogfooding: this repository's own docs/project lints clean", async () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
  const { findings, filesChecked } = await lintProject(repoRoot);
  assert.ok(filesChecked >= 5, `expected to check our own docs, checked ${filesChecked}`);
  assert.deepEqual(findings, []);
});

test("lintProject rejects a directory without docs/project", async () => {
  await assert.rejects(() => lintProject("/tmp"), /not found/);
});

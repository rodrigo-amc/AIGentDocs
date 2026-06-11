import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { lintMarkdown, lintProject } from "../src/index.js";

const doc = (frontmatter: string, body = "\n# Body\n"): string => `---\n${frontmatter}\n---\n${body}`;

const ROADMAP_BODY = "\n## Current Phase/Milestone\n\nMVP.\n\n## Task Board\n\n- task\n";
const SYSTEM_OVERVIEW_BODY =
  "\n## Context Diagram (C4 Level 1)\n\nx\n\n## Container Diagram (C4 Level 2)\n\nx\n\n## Folder Structure\n\nx\n\n## Architectural Patterns\n\nx\n";
const ADR_BODY = "\n## Context and Problem\n\nx\n\n## Decision\n\nx\n\n## Consequences\n\nx\n";
const CORRECTION_BODY = "\n## Defect Report\n\nx\n\n## Impact Map\n\n| a | b | c |\n";
const MODULE_BODY =
  "\n## Description\n\nx\n\n## Attributes / Properties\n\n| a | b | c |\n\n## Business Rules\n\n- BR-01\n\n## User Stories\n\n### US-001: Thing\n\n- [ ] AC-01: works\n\n## Relationships\n\nNone.\n";

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
  assert.deepEqual(rules(doc("type: roadmap\nversion: 1.0\nlast_updated: 2026-06-11\ncurrent_phase: MVP", ROADMAP_BODY)), []);
});

test("unknown document type is a warning", () => {
  const findings = lintMarkdown("test.md", doc("type: banana\nversion: 1.0\nlast_updated: 2026-06-11"));
  assert.deepEqual(findings.map((f) => [f.rule, f.severity]), [["frontmatter/unknown-type", "warning"]]);
});

test("state-bearing types: missing state warns, invalid state is critical", () => {
  const base = "type: system_overview\nversion: 1.0\nlast_updated: 2026-06-11";
  assert.ok(rules(doc(base, SYSTEM_OVERVIEW_BODY)).includes("frontmatter/state-missing"));
  assert.ok(rules(doc(`${base}\nstate: in-progress`, SYSTEM_OVERVIEW_BODY)).includes("frontmatter/state-value"));
  assert.deepEqual(rules(doc(`${base}\nstate: doing`, SYSTEM_OVERVIEW_BODY)), []);
});

test("ADR status is validated against the allowed values", () => {
  const base = "type: adr\nversion: 1.0\nlast_updated: 2026-06-11\nid: 7\ndate: 2026-06-11";
  assert.ok(rules(doc(`${base}\nstatus: pending`, ADR_BODY)).includes("frontmatter/adr-status"));
  assert.deepEqual(rules(doc(`${base}\nstatus: accepted`, ADR_BODY)), []);
});

test("correction status is validated against the allowed values", () => {
  const base = "type: correction\nversion: 1.0\nlast_updated: 2026-06-11";
  assert.ok(rules(doc(`${base}\nstatus: accepted`, CORRECTION_BODY)).includes("frontmatter/correction-status"));
  assert.deepEqual(rules(doc(`${base}\nstatus: approved`, CORRECTION_BODY)), []);
});

test("domain modules must carry code_paths as an array", () => {
  const base = "type: domain_module\nversion: 1.0\nlast_updated: 2026-06-11\nstate: pending";
  assert.ok(rules(doc(base, MODULE_BODY)).includes("frontmatter/code-paths"));
  assert.ok(rules(doc(`${base}\ncode_paths: src/`, MODULE_BODY)).includes("frontmatter/code-paths"));
  assert.deepEqual(rules(doc(`${base}\ncode_paths: ["src/"]`, MODULE_BODY)), []);
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

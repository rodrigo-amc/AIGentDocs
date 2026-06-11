import { test } from "node:test";
import assert from "node:assert/strict";

import { lintMarkdown } from "../src/index.js";

const COMMON = "version: 1.0\nlast_updated: 2026-06-11";

function rules(content: string): string[] {
  return lintMarkdown("test.md", content).map((f) => f.rule);
}

const roadmapDoc = (body: string): string => `---\ntype: roadmap\n${COMMON}\ncurrent_phase: MVP\n---\n${body}`;

test("missing [REQUIRED] section is critical", () => {
  const found = rules(roadmapDoc("\n## Current Phase/Milestone\n\nMVP.\n"));
  assert.deepEqual(found, ["section/missing"]); // Task Board missing
});

test("empty [REQUIRED] section (comments only) is critical", () => {
  const found = rules(roadmapDoc("\n## Current Phase/Milestone\n\nMVP.\n\n## Task Board\n\n<!-- fill me -->\n"));
  assert.deepEqual(found, ["section/empty"]);
});

test("subsections count as content of their parent section", () => {
  const found = rules(roadmapDoc("\n## Current Phase/Milestone\n\nMVP.\n\n## Task Board\n\n### [In Progress]\n\n- task\n"));
  assert.deepEqual(found, []);
});

test("heading matching tolerates spacing around slashes and case", () => {
  const found = rules(roadmapDoc("\n## Current phase / milestone\n\nMVP.\n\n## TASK BOARD\n\n- x\n"));
  assert.deepEqual(found, []);
});

const moduleDoc = (usBlock: string): string =>
  `---\ntype: domain_module\nmodule_name: m\n${COMMON}\nstate: pending\ncode_paths: []\n---\n` +
  "\n## Description\n\nA module.\n\n## Attributes / Properties\n\n| a | b | c |\n\n## Business Rules\n\n- BR-01\n\n## User Stories\n\n" +
  usBlock +
  "\n## Relationships\n\nNone.\n";

test("a US without ACs is critical", () => {
  const found = rules(moduleDoc("### US-001: Login\n\n**As a** user, **I want** in, **so that** value.\n"));
  assert.ok(found.includes("us/no-acceptance-criteria"));
});

test("a US with more than 6 ACs is a warning for human decision", () => {
  const acs = Array.from({ length: 7 }, (_, i) => `- [ ] AC-0${i + 1}: thing ${i + 1}`).join("\n");
  const found = rules(moduleDoc(`### US-001: Login\n\n${acs}\n`));
  assert.ok(found.includes("threshold/us-ac-count"));
});

test("a US with 1-6 ACs passes", () => {
  const found = rules(moduleDoc("### US-001: Login\n\n- [ ] AC-01: works\n- [x] AC-02: done\n"));
  assert.deepEqual(found, []);
});

test("an oversized Mermaid diagram is a suggestion", () => {
  const edges = Array.from({ length: 25 }, (_, i) => `  N${i} --> N${i + 1}`).join("\n");
  const found = rules(roadmapDoc(`\n## Current Phase/Milestone\n\nMVP.\n\n## Task Board\n\n\`\`\`mermaid\ngraph TD\n${edges}\n\`\`\`\n`));
  assert.ok(found.includes("threshold/mermaid-size"));
});

test("an applied Correction Record needs a non-empty Resolution", () => {
  const record = (status: string, resolution: string): string =>
    `---\ntype: correction\n${COMMON}\nid: 1\nstatus: ${status}\n---\n\n## Defect Report\n\nBad.\n\n## Impact Map\n\n| a | b | c |\n${resolution}`;
  assert.ok(rules(record("applied", "")).includes("section/correction-resolution"));
  assert.deepEqual(rules(record("applied", "\n## Resolution\n\nFixed everything.\n")), []);
  assert.deepEqual(rules(record("approved", "")), []);
});

import { test } from "node:test";
import assert from "node:assert/strict";

import { extractFrontmatter } from "../src/index.js";

test("extracts a valid frontmatter mapping", () => {
  const result = extractFrontmatter("---\ntype: vision\nversion: 1.0\n---\n\n# Title\n");
  assert.equal(result.found, true);
  assert.equal(result.error, undefined);
  assert.equal(result.data?.["type"], "vision");
});

test("reports not found when the file does not start with a fence", () => {
  assert.equal(extractFrontmatter("# Just a title\n").found, false);
  assert.equal(extractFrontmatter("\n---\ntype: x\n---\n").found, false);
});

test("reports a parse error for broken YAML", () => {
  const result = extractFrontmatter("---\ntype: [unclosed\n---\n");
  assert.equal(result.found, true);
  assert.notEqual(result.error, undefined);
});

test("rejects non-mapping frontmatter", () => {
  const result = extractFrontmatter("---\n- a\n- b\n---\n");
  assert.equal(result.found, true);
  assert.match(result.error ?? "", /not a YAML mapping/);
});

test("a leading UTF-8 BOM is tolerated", () => {
  const result = extractFrontmatter("\uFEFF---\ntype: vision\nversion: 1.0\n---\n\n# Title\n");
  assert.equal(result.found, true);
  assert.equal(result.data?.["type"], "vision");
});

test("ISO dates stay strings under the core schema", () => {
  const result = extractFrontmatter("---\nlast_updated: 2026-06-11\n---\n");
  assert.equal(typeof result.data?.["last_updated"], "string");
});

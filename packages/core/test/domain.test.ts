import { test } from "node:test";
import assert from "node:assert/strict";

import { ADR_STATUSES, CORRECTION_STATUSES, REQUIRED_COMMON_FIELDS, STATES } from "../src/index.js";

test("state values mirror the standard's frontmatter conventions", () => {
  assert.deepEqual([...STATES], ["pending", "doing", "done", "deprecated"]);
});

test("ADR status values mirror guide_adrs.md", () => {
  assert.deepEqual([...ADR_STATUSES], ["proposed", "accepted", "rejected", "superseded"]);
});

test("correction status values mirror guide_corrections.md", () => {
  assert.deepEqual([...CORRECTION_STATUSES], ["proposed", "approved", "applied", "rejected"]);
});

test("required common frontmatter fields mirror README.md", () => {
  assert.deepEqual([...REQUIRED_COMMON_FIELDS], ["type", "version", "last_updated"]);
});

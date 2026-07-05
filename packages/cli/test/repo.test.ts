import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Repo-level configuration guards (2026-07-04 review round). They live here
 * with the other REPO_ROOT-coupled tests for now; T-18 will decide the final
 * home for repo-level tests.
 */

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");

test("root package.json enforces the npm >=10 floor that tech_stack.yaml declares", async () => {
  const pkg = JSON.parse(await readFile(path.join(REPO_ROOT, "package.json"), "utf8")) as {
    engines?: Record<string, string>;
  };
  assert.equal(pkg.engines?.["node"], ">=20.12");
  assert.equal(pkg.engines?.["npm"], ">=10");
});

test("action.yml never interpolates inputs into the script — all three go through env", async () => {
  const action = await readFile(path.join(REPO_ROOT, "action.yml"), "utf8");
  const runBlock = action.slice(action.indexOf("run: |"));
  assert.equal(runBlock.includes("${{"), false, "the run script must not contain GitHub expression interpolation");
  for (const input of ["inputs.path", "inputs.version", "inputs.fail-on"]) {
    const envLine = new RegExp(`^\\s+AIGENTDOCS_[A-Z_]+: \\$\\{\\{ ${input.replace(".", "\\.")} \\}\\}$`, "m");
    assert.match(action, envLine, `${input} must be routed through an env: entry`);
  }
});

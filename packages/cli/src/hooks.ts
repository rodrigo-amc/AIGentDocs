import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Pre-commit hook installation. Design constraint (T-07): the tool informs,
 * the human decides — only critical findings block, and the failure message
 * always shows the conscious bypass.
 */

const HOOK = `#!/bin/sh
# AIGentDocs pre-commit hook — validates documentation compliance.
# Installed by 'aigentdocs hooks install'. Deterministic; no LLM involved.
#
# The tool informs, the human decides: only critical findings block,
# and you can always consciously bypass this check.

# A missing CLI is a tooling condition, not a documentation finding:
# inform and let the commit through instead of blocking every commit.
if [ ! -x "node_modules/.bin/aigentdocs" ]; then
  echo "aigentdocs: CLI not installed locally — skipping the documentation check."
  echo "Enable it with: npm install -D aigentdocs"
  exit 0
fi

node_modules/.bin/aigentdocs lint
status=$?
if [ $status -ne 0 ]; then
  echo ""
  echo "Documentation compliance check failed (see findings above)."
  echo "Fix the documentation, or to proceed anyway — consciously — run:"
  echo ""
  echo "    git commit --no-verify"
  echo ""
  exit $status
fi
`;

const exists = (p: string): Promise<boolean> => access(p).then(() => true, () => false);

/** Write .git/hooks/pre-commit in the repository at targetDir. Returns the written path. */
export async function installPreCommitHook(targetDir: string): Promise<string> {
  const gitDir = path.join(targetDir, ".git");
  if (!(await exists(gitDir))) {
    throw new Error(`'${targetDir}' is not a git repository ('.git' not found)`);
  }
  const hookPath = path.join(gitDir, "hooks", "pre-commit");
  if (await exists(hookPath)) {
    throw new Error(
      `'${hookPath}' already exists — refusing to overwrite. Append the 'aigentdocs lint' call to your existing hook manually.`,
    );
  }
  await mkdir(path.dirname(hookPath), { recursive: true });
  await writeFile(hookPath, HOOK, { mode: 0o755 });
  return hookPath;
}

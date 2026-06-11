import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Pre-commit hook installation. Design constraint (T-07): the tool informs,
 * the human decides — only critical findings block, and the failure message
 * always shows the conscious bypass.
 */

const HOOK = `#!/bin/sh
# AIGenticDocs pre-commit hook — validates documentation compliance.
# Installed by 'aigenticdocs hooks install'. Deterministic; no LLM involved.
#
# The tool informs, the human decides: only critical findings block,
# and you can always consciously bypass this check.

npx --no-install aigenticdocs lint
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
      `'${hookPath}' already exists — refusing to overwrite. Append the 'aigenticdocs lint' call to your existing hook manually.`,
    );
  }
  await mkdir(path.dirname(hookPath), { recursive: true });
  await writeFile(hookPath, HOOK, { mode: 0o755 });
  return hookPath;
}

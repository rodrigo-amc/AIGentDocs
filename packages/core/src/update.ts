import { access, cp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { parseYaml } from "./frontmatter.js";

/**
 * `update` — upgrade an adopter's docs/standard/ to the standard bundled
 * with the CLI.
 *
 * Version detection needs no configuration: the adopter's own copy of
 * changelog.yaml declares the installed version (top entry), and the
 * packaged standard declares the available one. The entries between the
 * two ARE the migration notes.
 *
 * README.md is the adopter's customization point (title, conventions), so
 * a customized README is preserved and the incoming one is written next to
 * it as README.md.new for manual merging. An uncustomized README (still
 * carrying the generic title) is simply replaced.
 */

export interface ChangelogEntry {
  version: string;
  date?: string;
  summary?: string;
}

export interface UpdateResult {
  status: "up-to-date" | "would-update" | "updated" | "ahead";
  /** Installed standard version (top of the adopter's changelog copy). */
  from: string;
  /** Packaged standard version. */
  to: string;
  /** Changelog entries newer than `from` — the migration notes. */
  notes: ChangelogEntry[];
  /** True when README.md was preserved and README.md.new needs a manual merge. */
  readmeNeedsMerge: boolean;
}

const GENERIC_README_TITLE = "# Documentation Standard for AI-Augmented Software Engineering";

/** Compare dotted numeric versions ("1.4.3" vs "1.4"): -1 | 0 | 1. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) {
      return diff < 0 ? -1 : 1;
    }
  }
  return 0;
}

async function readChangelog(standardDir: string): Promise<ChangelogEntry[]> {
  const file = path.join(standardDir, "changelog.yaml");
  const parsed = parseYaml(await readFile(file, "utf8"));
  if (!Array.isArray(parsed) || parsed.length === 0 || typeof (parsed[0] as ChangelogEntry).version !== "string") {
    throw new Error(`'${file}' does not look like a standard changelog`);
  }
  return parsed as ChangelogEntry[];
}

export async function updateStandard(
  targetDir: string,
  packagedStandardDir: string,
  options: { check?: boolean } = {},
): Promise<UpdateResult> {
  const installedDir = path.join(targetDir, "docs", "standard");
  await access(installedDir).catch(() => {
    throw new Error(`'${installedDir}' not found — is this an AIGentDocs repository?`);
  });

  const from = (await readChangelog(installedDir))[0]?.version ?? "0.0.0";
  const packaged = await readChangelog(packagedStandardDir);
  const to = packaged[0]?.version ?? "0.0.0";

  const base: UpdateResult = { status: "up-to-date", from, to, notes: [], readmeNeedsMerge: false };
  const cmp = compareVersions(from, to);
  if (cmp === 0) {
    return base;
  }
  if (cmp > 0) {
    return { ...base, status: "ahead" };
  }

  const notes = packaged.filter((entry) => compareVersions(entry.version, from) > 0);
  if (options.check === true) {
    return { ...base, status: "would-update", notes };
  }

  const theirReadme = await readFile(path.join(installedDir, "README.md"), "utf8").catch(() => undefined);
  await rm(installedDir, { recursive: true, force: true });
  await cp(packagedStandardDir, installedDir, { recursive: true });

  let readmeNeedsMerge = false;
  const customized = theirReadme !== undefined && !theirReadme.startsWith(GENERIC_README_TITLE);
  if (customized) {
    const incoming = await readFile(path.join(installedDir, "README.md"), "utf8");
    if (incoming !== theirReadme) {
      await writeFile(path.join(installedDir, "README.md"), theirReadme);
      await writeFile(path.join(installedDir, "README.md.new"), incoming);
      readmeNeedsMerge = true;
    }
  }

  return { ...base, status: "updated", notes, readmeNeedsMerge };
}

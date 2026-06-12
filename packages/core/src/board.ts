import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { STATES, type State } from "./index.js";
import { extractFrontmatter, setYamlKey } from "./frontmatter.js";
import { loadProject } from "./project.js";

/** One section of the roadmap's Kanban board, e.g. "[In Progress]". */
export interface BoardSection {
  name: string;
  items: string[];
}

/** Parse the Task Board sections of a roadmap document. */
export function parseTaskBoard(content: string): BoardSection[] {
  const sections: BoardSection[] = [];
  let current: BoardSection | undefined;
  let inFence = false;
  for (const line of content.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }
    const heading = /^###\s+(\[.+?\])\s*$/.exec(line);
    if (heading) {
      current = { name: heading[1] ?? "", items: [] };
      sections.push(current);
      continue;
    }
    if (/^##\s/.test(line)) {
      current = undefined; // left the board area
      continue;
    }
    const item = /^\s*[-*]\s+(.+)$/.exec(line);
    if (item && current !== undefined) {
      current.items.push(item[1] ?? "");
    }
  }
  return sections;
}

export interface UpdateModuleStateResult {
  module: string;
  state: State;
  /** Files actually modified, relative to the repo root. */
  updated: string[];
  /** Reminders the caller (an agent) must still handle by hand. */
  reminders: string[];
}

/**
 * Update a domain module's state in the two machine-owned places —
 * project_status.yaml (the authoritative record) and the module's
 * frontmatter — keeping them in sync, as the Anti-Drift Protocol requires.
 * The Kanban board is prose and stays the caller's responsibility.
 */
export async function updateModuleState(repoRoot: string, moduleName: string, state: State): Promise<UpdateModuleStateResult> {
  if (!(STATES as readonly string[]).includes(state)) {
    throw new Error(`invalid state '${state}' (allowed: ${STATES.join(" | ")})`);
  }
  const model = await loadProject(repoRoot);

  const moduleDoc = model.documents.find(
    (doc) =>
      doc.frontmatter?.["type"] === "domain_module" &&
      (doc.frontmatter?.["module_name"] === moduleName || path.posix.basename(doc.relPath, ".md") === moduleName),
  );
  if (moduleDoc === undefined) {
    throw new Error(`no domain module named '${moduleName}' found under docs/project/01_product/domain_modules/`);
  }

  const updated: string[] = [];
  const reminders: string[] = ["Move the corresponding item on the roadmap.md board yourself — it is prose, not machine-owned."];

  // 1. Frontmatter (a view).
  const fm = extractFrontmatter(moduleDoc.content);
  if (fm.data === undefined) {
    throw new Error(`'${moduleDoc.relPath}' has no parseable frontmatter`);
  }
  const newContent = moduleDoc.content.replace(/^(---\r?\n[\s\S]*?^state:)[^\n]*$/m, `$1 ${state}`);
  if (newContent === moduleDoc.content && fm.data["state"] !== state) {
    throw new Error(`could not locate the 'state:' line in '${moduleDoc.relPath}' frontmatter`);
  }
  await writeFile(path.join(repoRoot, moduleDoc.relPath), newContent);
  updated.push(moduleDoc.relPath);

  // 2. project_status.yaml (the authority), comment-preserving.
  if (model.projectStatus !== undefined && model.projectStatus.parseError === undefined) {
    const statusPath = path.join(repoRoot, model.projectStatus.relPath);
    const text = await readFile(statusPath, "utf8");
    await writeFile(statusPath, setYamlKey(text, ["modules", moduleName, "state"], state));
    updated.push(model.projectStatus.relPath);
  } else {
    reminders.push("project_status.yaml is absent (Lite profile?) or unparseable — only the frontmatter was updated.");
  }

  return { module: moduleName, state, updated, reminders };
}

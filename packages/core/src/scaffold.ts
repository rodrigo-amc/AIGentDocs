import { access, cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * `init` — scaffold the AIGentDocs structure into a repository.
 *
 * - full: docs/standard/ + empty docs/project/ tree + status artifacts
 *   (project_status.yaml, TODO.md, stamped with today's date) + AGENTS.md.
 *   Content documents are NOT created: sessions create them from templates
 *   (empty placeholders would wrongly signal Onboarding Mode).
 * - lite: docs/standard/ + the three Lite files copied from templates
 *   (vision.md, roadmap.md, tech_stack.yaml) + AGENTS.md. Running `lint`
 *   right after a lite init lists the empty [REQUIRED] sections — that is
 *   the adopter's documentation to-do list, by design.
 */

export type InitProfile = "full" | "lite";

export interface InitResult {
  profile: InitProfile;
  /** Paths created, relative to the target directory. */
  created: string[];
}

const exists = (p: string): Promise<boolean> => access(p).then(() => true, () => false);

const FULL_PROJECT_DIRS = [
  "01_product/domain_modules",
  "02_architecture",
  "03_engineering",
  "04_adrs",
  "05_corrections",
];

export async function initProject(targetDir: string, standardDir: string, profile: InitProfile): Promise<InitResult> {
  const docsDir = path.join(targetDir, "docs");
  if (await exists(docsDir)) {
    throw new Error(`'${docsDir}' already exists — refusing to overwrite. Remove it or run init in a clean repository.`);
  }
  if (!(await exists(path.join(standardDir, "PROTOCOL.md")))) {
    throw new Error(`'${standardDir}' does not look like the standard (PROTOCOL.md not found)`);
  }

  const created: string[] = [];
  const today = new Date().toISOString().slice(0, 10);

  await mkdir(docsDir, { recursive: true });
  await cp(standardDir, path.join(docsDir, "standard"), { recursive: true });
  created.push("docs/standard/");

  const copyTemplate = async (template: string, relTarget: string): Promise<void> => {
    const target = path.join(targetDir, relTarget);
    await mkdir(path.dirname(target), { recursive: true });
    const content = await readFile(path.join(standardDir, "templates", template), "utf8");
    await writeFile(target, content.replaceAll("YYYY-MM-DD", today));
    created.push(relTarget);
  };

  if (profile === "lite") {
    await copyTemplate("vision.md", "docs/project/01_product/vision.md");
    await copyTemplate("roadmap.md", "docs/project/01_product/roadmap.md");
    await copyTemplate("tech_stack.yaml", "docs/project/03_engineering/tech_stack.yaml");
  } else {
    for (const dir of FULL_PROJECT_DIRS) {
      await mkdir(path.join(targetDir, "docs", "project", dir), { recursive: true });
      created.push(`docs/project/${dir}/`);
    }
    await copyTemplate("project_status.yaml", "docs/project/project_status.yaml");
    await copyTemplate("TODO.md", "docs/project/TODO.md");
  }

  if (await exists(path.join(targetDir, "AGENTS.md"))) {
    created.push("(AGENTS.md already present — left untouched)");
  } else {
    await copyTemplate("AGENTS.md", "AGENTS.md");
  }

  return { profile, created };
}

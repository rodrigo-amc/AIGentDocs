import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { extractFrontmatter, parseYaml } from "./frontmatter.js";

/** One markdown document under docs/project/, with its frontmatter pre-parsed. */
export interface ProjectDocument {
  /** Path relative to the repository root, POSIX-style. */
  relPath: string;
  content: string;
  /** Parsed frontmatter mapping; undefined when missing or unparseable. */
  frontmatter?: Record<string, unknown>;
}

/** A YAML artifact (tech_stack.yaml, project_status.yaml). */
export interface YamlArtifact {
  relPath: string;
  /** Parsed content; undefined when the file does not parse. */
  data?: unknown;
  parseError?: string;
}

export interface ProjectModel {
  repoRoot: string;
  documents: ProjectDocument[];
  techStack?: YamlArtifact;
  projectStatus?: YamlArtifact;
}

async function loadYamlArtifact(repoRoot: string, relPath: string): Promise<YamlArtifact | undefined> {
  const absPath = path.join(repoRoot, relPath);
  const exists = await access(absPath).then(() => true, () => false);
  if (!exists) {
    return undefined;
  }
  const text = await readFile(absPath, "utf8");
  try {
    return { relPath, data: parseYaml(text) };
  } catch (error) {
    return { relPath, parseError: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Load every documentation artifact under `<repoRoot>/docs/project/`.
 * Throws if the directory does not exist (not an AIGenticDocs repository).
 */
export async function loadProject(repoRoot: string): Promise<ProjectModel> {
  const projectDir = path.join(repoRoot, "docs", "project");
  await access(projectDir).catch(() => {
    throw new Error(`'${projectDir}' not found — is this an AIGenticDocs repository?`);
  });

  const entries = await readdir(projectDir, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();

  const documents: ProjectDocument[] = [];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    const fm = extractFrontmatter(content);
    documents.push({
      relPath: path.relative(repoRoot, file).split(path.sep).join("/"),
      content,
      frontmatter: fm.data,
    });
  }

  return {
    repoRoot,
    documents,
    techStack: await loadYamlArtifact(repoRoot, "docs/project/03_engineering/tech_stack.yaml"),
    projectStatus: await loadYamlArtifact(repoRoot, "docs/project/project_status.yaml"),
  };
}

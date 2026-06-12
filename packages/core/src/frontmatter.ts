import { parse, parseDocument } from "yaml";

/**
 * Result of looking for a YAML frontmatter block at the top of a markdown file.
 * `yaml` is the only module allowed to be imported here (ADR-0003); everything
 * else in the tooling goes through this wrapper.
 */
export interface FrontmatterResult {
  /** True when a `---` ... `---` block exists at the very top of the file. */
  found: boolean;
  /** The parsed mapping, when found and valid. */
  data?: Record<string, unknown>;
  /** Parse or shape error, when found but unusable. */
  error?: string;
}

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Parse a full YAML document. Throws on invalid YAML (caller decides severity). */
export function parseYaml(text: string): unknown {
  return parse(text);
}

/**
 * Set a value at a key path inside a YAML document, preserving the
 * document's comments and formatting. Throws on invalid YAML.
 */
export function setYamlKey(text: string, path: Array<string | number>, value: unknown): string {
  const doc = parseDocument(text);
  if (doc.errors.length > 0) {
    throw new Error(doc.errors[0]?.message ?? "invalid YAML");
  }
  doc.setIn(path, value);
  return doc.toString();
}

export function extractFrontmatter(markdown: string): FrontmatterResult {
  const match = FENCE.exec(markdown);
  if (!match) {
    return { found: false };
  }
  let parsed: unknown;
  try {
    parsed = parse(match[1] ?? "");
  } catch (error) {
    return { found: true, error: error instanceof Error ? error.message : String(error) };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { found: true, error: "frontmatter is not a YAML mapping" };
  }
  return { found: true, data: parsed as Record<string, unknown> };
}

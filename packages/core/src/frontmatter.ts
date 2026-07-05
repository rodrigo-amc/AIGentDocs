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

/** Byte-order mark some Windows editors prepend — tolerated, never required. */
const BOM = "\uFEFF";

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

/**
 * Locate the frontmatter fence block at the top of the file (after an
 * optional BOM). Returns absolute offsets into `markdown` — the slice
 * `[start, end)` is the whole block including both `---` fences — so
 * callers can edit the block in place without ever touching the body.
 */
export function locateFrontmatterBlock(markdown: string): { start: number; end: number } | undefined {
  const offset = markdown.startsWith(BOM) ? BOM.length : 0;
  const match = FENCE.exec(markdown.slice(offset));
  if (!match) {
    return undefined;
  }
  return { start: offset, end: offset + match[0].length };
}

export function extractFrontmatter(markdown: string): FrontmatterResult {
  const match = FENCE.exec(markdown.startsWith(BOM) ? markdown.slice(BOM.length) : markdown);
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

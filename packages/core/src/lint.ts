import {
  ADR_STATUSES,
  CORRECTION_STATUSES,
  REQUIRED_COMMON_FIELDS,
  STATES,
  type Finding,
} from "./index.js";
import { extractFrontmatter } from "./frontmatter.js";
import { checkConsistency } from "./consistency.js";
import { checkSections } from "./sections.js";
import { loadProject } from "./project.js";

/**
 * Lint v0 — the frontmatter slice of the Mechanical layer of AGENT_REVIEW.md:
 * block presence, required common fields, allowed state/status values,
 * date format, and array-typed fields.
 */

/** Document types whose frontmatter carries the `state` field. */
const STATE_BEARING_TYPES = new Set([
  "quality_attributes",
  "system_overview",
  "data_flow",
  "infrastructure",
  "testing_strategy",
  "api_guidelines",
  "domain_module",
]);

const KNOWN_TYPES = new Set([...STATE_BEARING_TYPES, "vision", "roadmap", "adr", "correction", "todo"]);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: unknown): boolean {
  if (typeof value !== "string" || !DATE_RE.test(value)) {
    return false;
  }
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y ?? 0, (m ?? 1) - 1, d ?? 0));
  return date.getUTCFullYear() === y && date.getUTCMonth() === (m ?? 1) - 1 && date.getUTCDate() === d;
}

function isOneOf(value: unknown, allowed: readonly string[]): boolean {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

/** Lint a single markdown document. `file` is used verbatim in findings. */
export function lintMarkdown(file: string, content: string): Finding[] {
  const findings: Finding[] = [];
  const add = (rule: string, severity: Finding["severity"], message: string): void => {
    findings.push({ rule, severity, file, message });
  };

  const fm = extractFrontmatter(content);
  if (!fm.found) {
    add("frontmatter/missing", "critical", "no YAML frontmatter block at the top of the file");
    return findings;
  }
  if (fm.error !== undefined || fm.data === undefined) {
    add("frontmatter/invalid-yaml", "critical", `frontmatter does not parse: ${fm.error ?? "unknown error"}`);
    return findings;
  }
  const data = fm.data;

  for (const field of REQUIRED_COMMON_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      add("frontmatter/required-fields", "critical", `missing required field '${field}'`);
    }
  }

  if (data["last_updated"] !== undefined && data["last_updated"] !== null && !isValidIsoDate(data["last_updated"])) {
    add("frontmatter/date-format", "critical", `'last_updated' must be a valid YYYY-MM-DD date, got '${String(data["last_updated"])}'`);
  }

  const type = data["type"];
  if (typeof type !== "string" || type === "") {
    return findings; // already reported by required-fields; nothing type-specific to check
  }
  if (!KNOWN_TYPES.has(type)) {
    add("frontmatter/unknown-type", "warning", `unknown document type '${type}'`);
    return findings;
  }

  findings.push(...checkSections(file, type, content, data));

  if (STATE_BEARING_TYPES.has(type)) {
    const state = data["state"];
    if (state === undefined || state === null) {
      add("frontmatter/state-missing", "warning", `documents of type '${type}' carry a 'state' field`);
    } else if (!isOneOf(state, STATES)) {
      add("frontmatter/state-value", "critical", `'state' must be one of ${STATES.join(" | ")}, got '${String(state)}'`);
    }
  }

  if (type === "adr") {
    const status = data["status"];
    if (!isOneOf(status, ADR_STATUSES)) {
      add("frontmatter/adr-status", "critical", `ADR 'status' must be one of ${ADR_STATUSES.join(" | ")}, got '${String(status)}'`);
    }
    if (typeof data["id"] !== "number") {
      add("frontmatter/adr-id", "warning", "ADR frontmatter should carry a numeric 'id'");
    }
    if (data["date"] !== undefined && data["date"] !== null && !isValidIsoDate(data["date"])) {
      add("frontmatter/date-format", "critical", `'date' must be a valid YYYY-MM-DD date, got '${String(data["date"])}'`);
    }
  }

  if (type === "correction") {
    const status = data["status"];
    if (!isOneOf(status, CORRECTION_STATUSES)) {
      add("frontmatter/correction-status", "critical", `Correction 'status' must be one of ${CORRECTION_STATUSES.join(" | ")}, got '${String(status)}'`);
    }
  }

  if (type === "domain_module") {
    if (!Array.isArray(data["code_paths"])) {
      add("frontmatter/code-paths", "critical", "domain modules must carry 'code_paths' as an array");
    }
    for (const field of ["entities", "depends_on"]) {
      if (data[field] !== undefined && data[field] !== null && !Array.isArray(data[field])) {
        add("frontmatter/array-fields", "warning", `'${field}' should be an array`);
      }
    }
  }

  return findings;
}

export interface LintProjectResult {
  findings: Finding[];
  filesChecked: number;
}

/**
 * Lint everything under `<repoRoot>/docs/project/`: per-document frontmatter
 * rules (v0) plus cross-document consistency rules (v1).
 * Throws if the directory does not exist (not an AIGenticDocs repository).
 */
export async function lintProject(repoRoot: string): Promise<LintProjectResult> {
  const model = await loadProject(repoRoot);

  const findings: Finding[] = [];
  for (const doc of model.documents) {
    findings.push(...lintMarkdown(doc.relPath, doc.content));
  }
  findings.push(...(await checkConsistency(model)));

  const filesChecked =
    model.documents.length + (model.techStack === undefined ? 0 : 1) + (model.projectStatus === undefined ? 0 : 1);
  return { findings, filesChecked };
}

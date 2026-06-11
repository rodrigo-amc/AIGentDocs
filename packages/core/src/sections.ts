import type { Finding } from "./index.js";

/**
 * Lint v2 — [REQUIRED] section presence/non-emptiness per document type and
 * countable thresholds (US with too many or zero ACs, oversized Mermaid
 * diagrams), per AGENT_REVIEW.md Mechanical layer.
 *
 * Section names are the canonical English headings of the standard's
 * templates. Projects documented in another language are not yet covered
 * by these checks (per-language catalogs are future work).
 */

/** Canonical [REQUIRED] headings per document type. */
const REQUIRED_SECTIONS: Record<string, string[]> = {
  vision: ["Elevator Pitch", "Problem It Solves", "Target Users (Personas)", "Project Scope", "Domain Glossary", "Domain Entity Map"],
  roadmap: ["Current Phase/Milestone", "Task Board"],
  quality_attributes: ["Performance", "Security"],
  domain_module: ["Description", "Attributes / Properties", "Business Rules", "User Stories", "Relationships"],
  system_overview: ["Context Diagram (C4 Level 1)", "Container Diagram (C4 Level 2)", "Folder Structure", "Architectural Patterns"],
  data_flow: ["Global Process View", "Data Model"],
  infrastructure: ["Environment", "Deployment Diagram", "CI/CD", "Variables and Secrets"],
  testing_strategy: ["Required Test Types", "Testing Tools", "Minimum Expected Coverage", "Test File Structure"],
  api_guidelines: ["API Standard", "Endpoint Conventions", "Request/Response Format", "Authentication and Authorization"],
  adr: ["Context and Problem", "Decision", "Consequences"],
  correction: ["Defect Report", "Impact Map"],
};

const MERMAID_NODE_LIMIT = 20;
const US_AC_LIMIT = 6;

interface Heading {
  level: number;
  text: string;
  /** Index of the line the heading is on. */
  line: number;
}

function parseHeadings(lines: string[]): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    const match = inFence ? null : /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (match) {
      headings.push({ level: match[1]?.length ?? 1, text: match[2] ?? "", line: i });
    }
  }
  return headings;
}

const normalize = (text: string): string => text.toLowerCase().replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/").trim();

/** Body of a section: from its heading to the next heading of same or higher level. */
function sectionBody(lines: string[], headings: Heading[], index: number): string {
  const start = (headings[index]?.line ?? 0) + 1;
  const level = headings[index]?.level ?? 1;
  let end = lines.length;
  for (let i = index + 1; i < headings.length; i++) {
    if ((headings[i]?.level ?? 6) <= level) {
      end = headings[i]?.line ?? lines.length;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

const isEmptyBody = (body: string): boolean =>
  body.replace(/<!--[\s\S]*?-->/g, "").replace(/^---\s*$/gm, "").trim() === "";

export function checkSections(file: string, type: string, content: string, frontmatter?: Record<string, unknown>): Finding[] {
  const findings: Finding[] = [];
  const add = (rule: string, severity: Finding["severity"], message: string): void => {
    findings.push({ rule, severity, file, message });
  };

  const lines = content.split(/\r?\n/);
  const headings = parseHeadings(lines);
  const byName = new Map<string, number>();
  headings.forEach((h, i) => {
    if (!byName.has(normalize(h.text))) {
      byName.set(normalize(h.text), i);
    }
  });

  // --- [REQUIRED] sections: present and non-empty ---------------------------
  for (const section of REQUIRED_SECTIONS[type] ?? []) {
    const index = byName.get(normalize(section));
    if (index === undefined) {
      add("section/missing", "critical", `missing [REQUIRED] section '${section}'`);
    } else if (isEmptyBody(sectionBody(lines, headings, index))) {
      add("section/empty", "critical", `[REQUIRED] section '${section}' is empty`);
    }
  }

  // --- Correction Records: Resolution is required once applied --------------
  if (type === "correction" && frontmatter?.["status"] === "applied") {
    const index = byName.get(normalize("Resolution"));
    if (index === undefined || isEmptyBody(sectionBody(lines, headings, index))) {
      add("section/correction-resolution", "critical", "an applied Correction Record must have a non-empty 'Resolution' section");
    }
  }

  // --- User Stories: every US needs ACs; more than 6 needs a human decision --
  if (type === "domain_module") {
    headings.forEach((h, i) => {
      const usMatch = /^(US-\d+)/i.exec(h.text);
      if (!usMatch) {
        return;
      }
      const acCount = (sectionBody(lines, headings, i).match(/^\s*[-*]\s*\[[ xX]\]\s*AC-/gm) ?? []).length;
      if (acCount === 0) {
        add("us/no-acceptance-criteria", "critical", `${usMatch[1]} has no Acceptance Criteria (expected '- [ ] AC-NN: ...' items)`);
      } else if (acCount > US_AC_LIMIT) {
        add("threshold/us-ac-count", "warning", `${usMatch[1]} has ${acCount} ACs (> ${US_AC_LIMIT}): ask the human to split it or approve it as indivisible`);
      }
    });
  }

  // --- Mermaid diagrams: rough node-count heuristic --------------------------
  for (const block of content.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)) {
    const nodes = countMermaidNodes(block[1] ?? "");
    if (nodes > MERMAID_NODE_LIMIT) {
      add("threshold/mermaid-size", "suggestion", `a Mermaid diagram has ~${nodes} nodes (> ${MERMAID_NODE_LIMIT}): consider splitting it`);
    }
  }

  return findings;
}

const MERMAID_KEYWORDS = new Set([
  "graph", "flowchart", "subgraph", "end", "direction", "sequencediagram", "participant", "actor",
  "erdiagram", "classdiagram", "statediagram", "note", "over", "alt", "else", "opt", "loop", "par",
  "and", "rect", "activate", "deactivate", "title", "td", "tb", "lr", "rl", "bt",
]);

/** Heuristic: unique identifiers appearing on relationship/edge lines. */
function countMermaidNodes(source: string): number {
  const ids = new Set<string>();
  for (const line of source.split(/\r?\n/)) {
    if (!/-->|---|==>|\.\.>|\|\|--|}o--|\|o--|}\|--|->>|-->>|--x|-x/.test(line)) {
      continue;
    }
    for (const token of line.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
      const id = token[0];
      if (!MERMAID_KEYWORDS.has(id.toLowerCase())) {
        ids.add(id);
      }
    }
  }
  return ids.size;
}

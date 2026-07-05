import { access } from "node:fs/promises";
import path from "node:path";

import { STATES, type Finding } from "./index.js";
import type { ProjectModel } from "./project.js";

/**
 * Lint v1 — cross-document consistency checks (Mechanical layer of
 * AGENT_REVIEW.md, "Consistency Validation"):
 *
 * - tech_stack.yaml ADR references resolve to files in 04_adrs/
 *   (empty `adr` is a suggestion: the Lite profile allows it).
 * - ADR supersedes/superseded_by reciprocity and superseded status.
 * - Domain module code_paths point to paths that exist in the repository.
 * - Roadmap references using the standard's `(see X.md)` / `(ver X.md)`
 *   convention resolve to project documents.
 * - project_status.yaml (when present) agrees with module frontmatter
 *   states — the authority rule of the Project Status Artifacts.
 */
export async function checkConsistency(model: ProjectModel): Promise<Finding[]> {
  const findings: Finding[] = [];
  const add = (rule: string, severity: Finding["severity"], file: string, message: string): void => {
    findings.push({ rule, severity, file, message });
  };

  const docsByType = new Map<string, typeof model.documents>();
  for (const doc of model.documents) {
    const type = doc.frontmatter?.["type"];
    if (typeof type === "string") {
      const list = docsByType.get(type) ?? [];
      list.push(doc);
      docsByType.set(type, list);
    }
  }

  // --- tech_stack.yaml → ADR references -----------------------------------
  if (model.techStack !== undefined) {
    if (model.techStack.parseError !== undefined) {
      add("yaml/invalid", "critical", model.techStack.relPath, `does not parse: ${model.techStack.parseError}`);
    } else {
      for (const [keyPath, adrRef] of collectAdrRefs(model.techStack.data, [])) {
        if (adrRef === "") {
          add("ref/tech-stack-adr-empty", "suggestion", model.techStack.relPath, `'${keyPath}' has no ADR recorded (allowed in the Lite profile; required in Full)`);
          continue;
        }
        const adrPath = path.join(model.repoRoot, "docs", "project", "04_adrs", adrRef);
        const exists = await access(adrPath).then(() => true, () => false);
        if (!exists) {
          add("ref/tech-stack-adr", "critical", model.techStack.relPath, `'${keyPath}' references ADR '${adrRef}', which does not exist in 04_adrs/`);
        }
      }
    }
  }

  // --- ADR reciprocity ------------------------------------------------------
  const adrs = (docsByType.get("adr") ?? []).map((doc) => ({
    doc,
    id: typeof doc.frontmatter?.["id"] === "number" ? (doc.frontmatter["id"] as number) : undefined,
    status: doc.frontmatter?.["status"],
    supersedes: doc.frontmatter?.["supersedes"] ?? null,
    supersededBy: doc.frontmatter?.["superseded_by"] ?? null,
  }));
  const adrById = new Map(adrs.filter((a) => a.id !== undefined).map((a) => [a.id, a]));

  for (const adr of adrs) {
    if (typeof adr.supersedes === "number") {
      const target = adrById.get(adr.supersedes);
      if (target === undefined) {
        add("ref/adr-supersedes-target", "critical", adr.doc.relPath, `supersedes ADR ${adr.supersedes}, which does not exist`);
      } else if (target.supersededBy !== adr.id) {
        add("adr/supersedes-reciprocity", "critical", target.doc.relPath, `must carry 'superseded_by: ${adr.id}' (it is superseded by ${adr.doc.relPath})`);
      }
    }
    if (adr.supersededBy !== null && adr.status !== "superseded") {
      add("adr/superseded-status", "warning", adr.doc.relPath, `has 'superseded_by' set, so its status should be 'superseded' (got '${String(adr.status)}')`);
    }
  }

  // --- Domain module code_paths ----------------------------------------------
  for (const doc of docsByType.get("domain_module") ?? []) {
    const codePaths = doc.frontmatter?.["code_paths"];
    if (!Array.isArray(codePaths)) {
      continue; // shape already reported by lint v0
    }
    for (const entry of codePaths) {
      if (typeof entry !== "string" || entry === "") {
        continue;
      }
      const target = path.join(model.repoRoot, entry.replace(/^\//, ""));
      const exists = await access(target).then(() => true, () => false);
      if (!exists) {
        add("ref/code-paths", "warning", doc.relPath, `code path '${entry}' does not exist in the repository`);
      }
    }
  }

  // --- Roadmap references: the standard's "(see X.md)" convention -------------
  const basenames = new Set(model.documents.map((doc) => path.posix.basename(doc.relPath)));
  const REF = /\((?:see|ver)\s+([A-Za-z0-9_.-]+\.(?:md|yaml))\)/g;
  for (const doc of docsByType.get("roadmap") ?? []) {
    for (const match of doc.content.matchAll(REF)) {
      const ref = match[1] ?? "";
      if (!basenames.has(ref) && ref !== "tech_stack.yaml" && ref !== "project_status.yaml") {
        add("ref/roadmap-reference", "warning", doc.relPath, `references '${ref}', which does not exist under docs/project/`);
      }
    }
  }

  // --- project_status.yaml authority rule -------------------------------------
  if (model.projectStatus !== undefined) {
    const statusFile = model.projectStatus.relPath;
    if (model.projectStatus.parseError !== undefined) {
      add("yaml/invalid", "critical", statusFile, `does not parse: ${model.projectStatus.parseError}`);
      return findings;
    }
    const data = model.projectStatus.data as Record<string, unknown> | null;
    const modules = (data?.["modules"] ?? {}) as Record<string, unknown>;
    const moduleDocs = new Map(
      (docsByType.get("domain_module") ?? []).map((doc) => [
        String(doc.frontmatter?.["module_name"] ?? path.posix.basename(doc.relPath, ".md")),
        doc,
      ]),
    );

    if (modules !== null && typeof modules === "object" && !Array.isArray(modules)) {
      for (const [name, value] of Object.entries(modules)) {
        const state = (value as Record<string, unknown> | null)?.["state"];
        if (typeof state !== "string" || !(STATES as readonly string[]).includes(state)) {
          add("status/state-value", "critical", statusFile, `module '${name}' has invalid state '${String(state)}'`);
          continue;
        }
        const moduleDoc = moduleDocs.get(name);
        if (moduleDoc === undefined) {
          add("status/unknown-module", "warning", statusFile, `module '${name}' has no document in domain_modules/`);
        } else if (moduleDoc.frontmatter?.["state"] !== state) {
          add("status/module-state-sync", "critical", moduleDoc.relPath, `frontmatter state '${String(moduleDoc.frontmatter?.["state"])}' contradicts project_status.yaml ('${state}') — project_status.yaml is authoritative`);
        }
      }
      for (const [name, doc] of moduleDocs) {
        if (!(name in modules)) {
          add("status/module-missing", "warning", doc.relPath, `module '${name}' is not registered in project_status.yaml`);
        }
      }
    }
  }

  return findings;
}

/** Recursively collect every `adr:` string value with its key path. */
function collectAdrRefs(node: unknown, keyPath: string[]): Array<[string, string]> {
  if (node === null || typeof node !== "object") {
    return [];
  }
  const refs: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    // A YAML null (`adr:` with no value) expresses the same author intent as
    // `adr: ""` — both get the Lite-profile suggestion.
    if (key === "adr" && (typeof value === "string" || value === null)) {
      refs.push([keyPath.join("."), value ?? ""]);
    } else {
      refs.push(...collectAdrRefs(value, [...keyPath, key]));
    }
  }
  return refs;
}

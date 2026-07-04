import { readFile } from "node:fs/promises";
import path from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  STATES,
  lintProject,
  loadProject,
  parseTaskBoard,
  updateModuleState,
  type State,
} from "@aigentdocs/core";

/**
 * The AIGentDocs MCP server (Layer 3): exposes the standard's operations as
 * tools for any MCP-capable agent. All domain logic lives in
 * @aigentdocs/core; this layer only declares tools and serializes results.
 *
 * Reference spec: the routing table "question type -> document to read".
 */

const text = (value: unknown): { content: Array<{ type: "text"; text: string }> } => ({
  content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
});

const fail = (message: string): { content: Array<{ type: "text"; text: string }>; isError: true } => ({
  content: [{ type: "text", text: message }],
  isError: true,
});

/** Session type -> the files that define its context, relative to docs/standard/. */
const SESSION_FILES: Record<string, { files: string[]; writeScope: string }> = {
  "01_product": {
    files: ["agent_product.md", "guide_product.md"],
    writeScope: "docs/project/01_product/ strategic documents only (vision.md, roadmap.md, quality_attributes.md)",
  },
  "01_product_domain_modules": {
    files: ["agent_product.md", "guide_domain_modules.md"],
    writeScope: "exactly one module file in docs/project/01_product/domain_modules/",
  },
  "02_architecture": {
    files: ["agent_architecture.md", "guide_architecture.md"],
    writeScope: "docs/project/02_architecture/ only",
  },
  "03_engineering": {
    files: ["agent_engineering.md", "guide_engineering.md"],
    writeScope: "docs/project/03_engineering/ only",
  },
  "04_adrs": {
    files: ["agent_adrs.md", "guide_adrs.md"],
    writeScope: "one new ADR in docs/project/04_adrs/, plus ADR Propagation into docs/project/03_engineering/ when it applies",
  },
  "05_corrections": {
    files: ["agent_corrections.md", "guide_corrections.md"],
    writeScope: "the Correction Record, then exactly the documents listed in its approved Impact Map",
  },
};

export function buildServer(repoRoot: string): McpServer {
  const server = new McpServer({ name: "aigentdocs", version: "0.1.0" });

  server.registerTool(
    "get_project_status",
    {
      description:
        "Aggregate state of the documented project: module states, coverage, and known debt from project_status.yaml (the authoritative record), or a per-document overview for Lite projects.",
      inputSchema: {},
    },
    async () => {
      try {
        const model = await loadProject(repoRoot);
        if (model.projectStatus?.data !== undefined) {
          return text(model.projectStatus.data);
        }
        const documents = model.documents.map((doc) => ({
          path: doc.relPath,
          type: doc.frontmatter?.["type"] ?? null,
          state: doc.frontmatter?.["state"] ?? null,
        }));
        return text({ note: "no project_status.yaml (Lite profile?) — per-document overview instead", documents });
      } catch (error) {
        return fail(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "get_active_task",
    {
      description:
        "The task to work on right now: the [In Progress] items of the roadmap board, falling back to the top of [To Do / Next]. Includes the current phase.",
      inputSchema: {},
    },
    async () => {
      try {
        const model = await loadProject(repoRoot);
        const roadmap = model.documents.find((doc) => doc.frontmatter?.["type"] === "roadmap");
        if (roadmap === undefined) {
          return fail("no roadmap document found under docs/project/");
        }
        const sections = parseTaskBoard(roadmap.content);
        const inProgress = sections.find((s) => /in progress/i.test(s.name))?.items ?? [];
        const next = sections.find((s) => /to do|next/i.test(s.name))?.items ?? [];
        return text({
          phase: roadmap.frontmatter?.["current_phase"] ?? null,
          active: inProgress,
          next_up: inProgress.length === 0 ? next.slice(0, 1) : [],
          note: "Per the standard: at most 1-2 items in [In Progress]; if empty, take the top of [To Do / Next].",
        });
      } catch (error) {
        return fail(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "get_module",
    {
      description: "Full content (frontmatter + body) of one domain module, by module name or file basename.",
      inputSchema: { name: z.string().describe("Module name, e.g. 'clients'") },
    },
    async ({ name }) => {
      try {
        const model = await loadProject(repoRoot);
        const moduleDoc = model.documents.find(
          (doc) =>
            doc.frontmatter?.["type"] === "domain_module" &&
            (doc.frontmatter?.["module_name"] === name || path.posix.basename(doc.relPath, ".md") === name),
        );
        if (moduleDoc === undefined) {
          const available = model.documents
            .filter((doc) => doc.frontmatter?.["type"] === "domain_module")
            .map((doc) => path.posix.basename(doc.relPath, ".md"));
          return fail(`no domain module '${name}'. Available: ${available.join(", ") || "(none)"}`);
        }
        return text(moduleDoc.content);
      } catch (error) {
        return fail(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "start_session",
    {
      description:
        "Load the operating context for a documentation session of the standard: the agent profile and guide that govern it, plus the session's write scope. Read docs/standard/PROTOCOL.md first if you haven't.",
      inputSchema: {
        type: z.enum(Object.keys(SESSION_FILES) as [string, ...string[]]).describe("Session type"),
      },
    },
    async ({ type }) => {
      try {
        const session = SESSION_FILES[type];
        if (session === undefined) {
          return fail(`unknown session type '${type}'`);
        }
        const parts: string[] = [
          `# Session: ${type}`,
          `WRITE SCOPE: ${session.writeScope}`,
          "Global rules: docs/standard/PROTOCOL.md (Session Guard, Anti-Drift Protocol, Operational Patterns).",
        ];
        for (const file of session.files) {
          const content = await readFile(path.join(repoRoot, "docs", "standard", file), "utf8");
          parts.push(`\n---\n# docs/standard/${file}\n\n${content}`);
        }
        return text(parts.join("\n"));
      } catch (error) {
        return fail(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "start_correction_session",
    {
      description:
        "Load a Correction Record for a 05_corrections session. Only an approved record's Impact Map authorizes writes; a proposed record means impact analysis is still read-only.",
      inputSchema: { id: z.number().int().describe("Correction Record id (frontmatter 'id')") },
    },
    async ({ id }) => {
      try {
        const model = await loadProject(repoRoot);
        const record = model.documents.find(
          (doc) => doc.frontmatter?.["type"] === "correction" && doc.frontmatter?.["id"] === id,
        );
        if (record === undefined) {
          return fail(`no Correction Record with id ${id} under docs/project/05_corrections/`);
        }
        const status = String(record.frontmatter?.["status"]);
        const scopeNote =
          status === "approved"
            ? "Status approved: the Impact Map below IS your write scope — nothing outside it."
            : status === "applied"
              ? "Status applied: this correction is already done; do not modify it."
              : `Status ${status}: read-only — analyze impact and/or wait for human approval before touching any document.`;
        return text(`# Correction Record ${id} (${record.relPath})\n${scopeNote}\nProtocol: docs/standard/agent_corrections.md.\n\n---\n${record.content}`);
      } catch (error) {
        return fail(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "update_module_state",
    {
      description:
        "Update a domain module's state in the machine-owned places — project_status.yaml (authoritative) and the module's frontmatter — keeping them in sync per the Anti-Drift Protocol. Moving the board item remains your job.",
      inputSchema: {
        module: z.string().describe("Module name"),
        state: z.enum(STATES).describe("New state"),
      },
    },
    async ({ module, state }) => {
      try {
        return text(await updateModuleState(repoRoot, module, state as State));
      } catch (error) {
        return fail(error instanceof Error ? error.message : String(error));
      }
    },
  );

  server.registerTool(
    "validate_docs",
    {
      description:
        "Run the deterministic documentation lint (the Mechanical layer of AGENT_REVIEW.md). Returns findings with severities; an empty list means compliant.",
      inputSchema: {},
    },
    async () => {
      try {
        return text(await lintProject(repoRoot));
      } catch (error) {
        return fail(error instanceof Error ? error.message : String(error));
      }
    },
  );

  return server;
}

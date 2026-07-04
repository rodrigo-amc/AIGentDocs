import { createRequire } from "node:module";
import path from "node:path";

import { adaptProject, initProject, lintProject, updateStandard, type Finding, type InitProfile } from "@aigentdocs/core";

import { installPreCommitHook } from "./hooks.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const HELP = `aigentdocs ${version} — tooling for the AIGentDocs docs-as-code standard

Usage: aigentdocs <command>   (or its short alias: agd <command>)

Commands:
  init [path] [--lite]   Scaffold docs/ into a repository (path defaults to
                         the current directory; --lite for the minimal profile)
  lint [path]            Validate documentation compliance (exits 1 on
                         critical findings)
  hooks install [path]   Install the pre-commit hook that runs lint (only
                         critical findings block; bypass: --no-verify)
  adapt [path] [--tool x]  Generate per-tool adapter files pointing to
                         AGENTS.md (tools: claude, cursor, copilot,
                         antigravity; default: all). Never overwrites
                         hand-edited files.
  update [path] [--check]  Upgrade docs/standard to this CLI's bundled
                         version (--check only reports; exits 1 if outdated)

Options:
  -h, --help     Show this help
  -v, --version  Show the CLI version
`;

/** Locate the packaged standard (ADR-0004). */
function standardDir(): string {
  const pkgJson = require.resolve("@aigentdocs/standard/package.json");
  return path.join(path.dirname(pkgJson), "standard");
}

export interface Io {
  out: (text: string) => void;
  err: (text: string) => void;
}

const ICONS: Record<Finding["severity"], string> = {
  critical: "🔴",
  warning: "🟡",
  suggestion: "🟢",
};

async function runLint(root: string, io: Io): Promise<number> {
  let findings: Finding[];
  let filesChecked: number;
  try {
    ({ findings, filesChecked } = await lintProject(root));
  } catch (error) {
    io.err(`aigentdocs: ${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }

  const byFile = new Map<string, Finding[]>();
  for (const finding of findings) {
    const list = byFile.get(finding.file) ?? [];
    list.push(finding);
    byFile.set(finding.file, list);
  }
  for (const [file, list] of byFile) {
    io.out(`${file}\n`);
    for (const f of list) {
      io.out(`  ${ICONS[f.severity]} ${f.rule}  ${f.message}\n`);
    }
  }

  const count = (severity: Finding["severity"]): number => findings.filter((f) => f.severity === severity).length;
  const criticals = count("critical");
  io.out(
    `${findings.length === 0 ? "No findings. " : "\n"}` +
      `${filesChecked} file(s) checked: ${criticals} critical, ${count("warning")} warning(s), ${count("suggestion")} suggestion(s).\n`,
  );
  return criticals > 0 ? 1 : 0;
}

/** Entry point of the CLI. Returns the process exit code. */
export async function main(argv: string[], io: Io): Promise<number> {
  const [command] = argv;

  if (command === undefined || command === "help" || command === "--help" || command === "-h") {
    io.out(HELP);
    return 0;
  }

  if (command === "--version" || command === "-v") {
    io.out(`${version}\n`);
    return 0;
  }

  if (command === "lint") {
    return runLint(argv[1] ?? process.cwd(), io);
  }

  if (command === "init") {
    const rest = argv.slice(1);
    const profile: InitProfile = rest.includes("--lite") ? "lite" : "full";
    const positional = rest.filter((arg) => !arg.startsWith("--"));
    const unknownFlags = rest.filter((arg) => arg.startsWith("--") && arg !== "--lite");
    if (unknownFlags.length > 0) {
      io.err(`aigentdocs: unknown init option '${unknownFlags[0]}'\n`);
      return 2;
    }
    const target = positional[0] ?? process.cwd();
    try {
      const result = await initProject(target, standardDir(), profile);
      io.out(`Initialized AIGentDocs (${result.profile} profile) in ${target}:\n`);
      for (const entry of result.created) {
        io.out(`  + ${entry}\n`);
      }
      io.out(
        "\nNext steps:\n" +
          "  1. Fill in the Project conventions in AGENTS.md" +
          (result.profile === "lite" ? " (set 'Adoption profile: lite')" : "") +
          ".\n" +
          "  2. Read docs/standard/PROTOCOL.md for the workflow and your operating rules.\n" +
          (result.profile === "lite"
            ? "  3. Run 'aigentdocs lint' — the empty [REQUIRED] sections it reports are your documentation to-do list.\n"
            : "  3. Start a 01_product session to create vision.md and roadmap.md from the templates.\n"),
      );
      return 0;
    } catch (error) {
      io.err(`aigentdocs: ${error instanceof Error ? error.message : String(error)}\n`);
      return 2;
    }
  }

  if (command === "adapt") {
    const rest = argv.slice(1);
    const tools: string[] = [];
    const positional: string[] = [];
    for (let i = 0; i < rest.length; i++) {
      const arg = rest[i] ?? "";
      if (arg === "--tool") {
        const value = rest[++i];
        if (value === undefined) {
          io.err("aigentdocs: --tool requires a value\n");
          return 2;
        }
        tools.push(...value.split(","));
      } else if (arg.startsWith("--")) {
        io.err(`aigentdocs: unknown adapt option '${arg}'\n`);
        return 2;
      } else {
        positional.push(arg);
      }
    }
    try {
      const result = await adaptProject(positional[0] ?? process.cwd(), tools);
      for (const entry of result.written) {
        io.out(`  + ${entry.file}  (${entry.description})\n`);
      }
      for (const skip of result.skipped) {
        io.out(`  ! ${skip.file}  (${skip.reason})\n`);
      }
      io.out(`\n${result.written.length} adapter(s) written, ${result.skipped.length} skipped. Adapters point to AGENTS.md — edit that file, then re-run adapt.\n`);
      return 0;
    } catch (error) {
      io.err(`aigentdocs: ${error instanceof Error ? error.message : String(error)}\n`);
      return 2;
    }
  }

  if (command === "update") {
    const rest = argv.slice(1);
    const check = rest.includes("--check");
    const positional = rest.filter((arg) => !arg.startsWith("--"));
    const unknownFlags = rest.filter((arg) => arg.startsWith("--") && arg !== "--check");
    if (unknownFlags.length > 0) {
      io.err(`aigentdocs: unknown update option '${unknownFlags[0]}'\n`);
      return 2;
    }
    try {
      const result = await updateStandard(positional[0] ?? process.cwd(), standardDir(), { check });
      switch (result.status) {
        case "up-to-date":
          io.out(`Standard is up to date (${result.from}).\n`);
          return 0;
        case "ahead":
          io.err(
            `aigentdocs: the installed standard (${result.from}) is newer than this CLI's (${result.to}).\n` +
              "Update the CLI instead: npm install -D aigentdocs@latest\n",
          );
          return 2;
        case "would-update":
        case "updated": {
          const verb = result.status === "updated" ? "Updated" : "Update available:";
          io.out(`${verb} ${result.from} -> ${result.to}\n\nChanges that need your attention:\n`);
          for (const note of result.notes) {
            io.out(`  ${note.version} (${note.date ?? "?"}): ${note.summary ?? ""}\n`);
          }
          io.out("\nDetails: docs/standard/changelog.yaml\n");
          return result.status === "would-update" ? 1 : 0;
        }
      }
    } catch (error) {
      io.err(`aigentdocs: ${error instanceof Error ? error.message : String(error)}\n`);
      return 2;
    }
  }

  if (command === "hooks") {
    if (argv[1] !== "install") {
      io.err(`aigentdocs: unknown hooks subcommand '${argv[1] ?? ""}'. Did you mean 'hooks install'?\n`);
      return 2;
    }
    try {
      const hookPath = await installPreCommitHook(argv[2] ?? process.cwd());
      io.out(`Installed pre-commit hook: ${hookPath}\n`);
      io.out("It runs 'aigentdocs lint' before each commit. Only critical findings block;\n");
      io.out("to consciously bypass it: git commit --no-verify\n");
      return 0;
    } catch (error) {
      io.err(`aigentdocs: ${error instanceof Error ? error.message : String(error)}\n`);
      return 2;
    }
  }

  io.err(`aigentdocs: unknown or not yet implemented command '${command}'. See 'aigentdocs help'.\n`);
  return 1;
}

import { createRequire } from "node:module";
import path from "node:path";

import { initProject, lintProject, type Finding, type InitProfile } from "@aigenticdocs/core";

import { installPreCommitHook } from "./hooks.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const HELP = `aigenticdocs ${version} — tooling for the AIGenticDocs docs-as-code standard

Usage: aigenticdocs <command>   (or its short alias: agd <command>)

Commands:
  init [path] [--lite]   Scaffold docs/ into a repository (path defaults to
                         the current directory; --lite for the minimal profile)
  lint [path]            Validate documentation compliance (exits 1 on
                         critical findings)
  hooks install [path]   Install the pre-commit hook that runs lint (only
                         critical findings block; bypass: --no-verify)
  adapt                  Generate per-tool adapter files        (planned: T-08)
  update                 Upgrade docs/standard to a new version (planned: T-11)

Options:
  -h, --help     Show this help
  -v, --version  Show the CLI version
`;

/** Locate the packaged standard (ADR-0004). */
function standardDir(): string {
  const pkgJson = require.resolve("@aigenticdocs/standard/package.json");
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
    io.err(`aigenticdocs: ${error instanceof Error ? error.message : String(error)}\n`);
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
      io.err(`aigenticdocs: unknown init option '${unknownFlags[0]}'\n`);
      return 2;
    }
    const target = positional[0] ?? process.cwd();
    try {
      const result = await initProject(target, standardDir(), profile);
      io.out(`Initialized AIGenticDocs (${result.profile} profile) in ${target}:\n`);
      for (const entry of result.created) {
        io.out(`  + ${entry}\n`);
      }
      io.out(
        "\nNext steps:\n" +
          "  1. Customize docs/standard/README.md (project name, conventions" +
          (result.profile === "lite" ? ", set 'Adoption profile: lite'" : "") +
          ").\n" +
          "  2. Read docs/standard/QUICKSTART.md for the workflow.\n" +
          (result.profile === "lite"
            ? "  3. Run 'aigenticdocs lint' — the empty [REQUIRED] sections it reports are your documentation to-do list.\n"
            : "  3. Start a 01_product session to create vision.md and roadmap.md from the templates.\n"),
      );
      return 0;
    } catch (error) {
      io.err(`aigenticdocs: ${error instanceof Error ? error.message : String(error)}\n`);
      return 2;
    }
  }

  if (command === "hooks") {
    if (argv[1] !== "install") {
      io.err(`aigenticdocs: unknown hooks subcommand '${argv[1] ?? ""}'. Did you mean 'hooks install'?\n`);
      return 2;
    }
    try {
      const hookPath = await installPreCommitHook(argv[2] ?? process.cwd());
      io.out(`Installed pre-commit hook: ${hookPath}\n`);
      io.out("It runs 'aigenticdocs lint' before each commit. Only critical findings block;\n");
      io.out("to consciously bypass it: git commit --no-verify\n");
      return 0;
    } catch (error) {
      io.err(`aigenticdocs: ${error instanceof Error ? error.message : String(error)}\n`);
      return 2;
    }
  }

  io.err(`aigenticdocs: unknown or not yet implemented command '${command}'. See 'aigenticdocs help'.\n`);
  return 1;
}

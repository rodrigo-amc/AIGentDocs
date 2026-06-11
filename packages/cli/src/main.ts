import { createRequire } from "node:module";

import { lintProject, type Finding } from "@aigenticdocs/core";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const HELP = `aigenticdocs ${version} — tooling for the AIGenticDocs docs-as-code standard

Usage: aigenticdocs <command>   (or its short alias: agd <command>)

Commands:
  lint [path]   Validate documentation compliance (path defaults to the
                current directory; exits 1 on critical findings)
  init          Scaffold docs/ into a repository       (planned: T-06)
  adapt         Generate per-tool adapter files        (planned: T-08)
  update        Upgrade docs/standard to a new version (planned: T-11)

Options:
  -h, --help     Show this help
  -v, --version  Show the CLI version
`;

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

  io.err(`aigenticdocs: unknown or not yet implemented command '${command}'. See 'aigenticdocs help'.\n`);
  return 1;
}

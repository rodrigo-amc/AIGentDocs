import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const HELP = `aigenticdocs ${version} — tooling for the AIGenticDocs docs-as-code standard

Usage: aigenticdocs <command>

Commands:
  init    Scaffold docs/ into a repository       (planned: T-06)
  lint    Validate documentation compliance      (in development: T-03..T-05)
  adapt   Generate per-tool adapter files        (planned: T-08)
  update  Upgrade docs/standard to a new version (planned: T-11)

Options:
  -h, --help     Show this help
  -v, --version  Show the CLI version
`;

export interface Io {
  out: (text: string) => void;
  err: (text: string) => void;
}

/** Entry point of the CLI. Returns the process exit code. */
export function main(argv: string[], io: Io): number {
  const [command] = argv;

  if (command === undefined || command === "help" || command === "--help" || command === "-h") {
    io.out(HELP);
    return 0;
  }

  if (command === "--version" || command === "-v") {
    io.out(`${version}\n`);
    return 0;
  }

  io.err(`aigenticdocs: unknown or not yet implemented command '${command}'. See 'aigenticdocs help'.\n`);
  return 1;
}

#!/usr/bin/env node
import { main } from "./main.js";

// Exit quietly when stdout is piped to a consumer that closes early
// (e.g. `aigentdocs lint | head`); EPIPE is not an error for a CLI.
process.stdout.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EPIPE") {
    process.exit(0);
  }
  throw error;
});

process.exitCode = await main(process.argv.slice(2), {
  out: (text) => process.stdout.write(text),
  err: (text) => process.stderr.write(text),
});

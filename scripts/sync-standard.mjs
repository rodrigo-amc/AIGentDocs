// Syncs docs/standard/ (the source of truth) into packages/standard/standard/
// (the npm-distributable copy, gitignored). Runs as part of `npm run build`.
// See ADR-0004.
import { cp, rm } from "node:fs/promises";

const src = new URL("../docs/standard/", import.meta.url);
const dest = new URL("../packages/standard/standard/", import.meta.url);

await rm(dest, { recursive: true, force: true });
await cp(src, dest, { recursive: true });

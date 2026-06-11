// Verifies the three places a standard version lives stay in sync:
// docs/standard/changelog.yaml (source of truth), packages/standard/package.json,
// and — when given as argument — a release tag (e.g. "standard-v1.4.3").
import { readFile } from "node:fs/promises";
import { parse } from "yaml";

const changelog = parse(await readFile(new URL("../docs/standard/changelog.yaml", import.meta.url), "utf8"));
const top = changelog[0]?.version;
const pkg = JSON.parse(await readFile(new URL("../packages/standard/package.json", import.meta.url), "utf8"));

if (pkg.version !== top) {
  console.error(`version mismatch: changelog.yaml says ${top}, packages/standard/package.json says ${pkg.version}`);
  process.exit(1);
}

const tag = process.argv[2];
if (tag !== undefined) {
  const tagged = tag.replace(/^standard-v/, "");
  if (tagged !== top) {
    console.error(`tag '${tag}' does not match the standard version ${top}`);
    process.exit(1);
  }
}

console.log(`standard version OK: ${top}`);
